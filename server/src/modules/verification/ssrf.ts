import dns from 'node:dns/promises';
import net from 'node:net';
import { ApiError } from '../../utils/ApiError';

const PRIVATE_IPV4 = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;
const RESERVED_IPV4 = /^(0\.|127\.|169\.254\.|224\.|240\.|255\.)/;

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return PRIVATE_IPV4.test(ip) || RESERVED_IPV4.test(ip);
  }
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // Loopback ::1, link-local fe80::/10, private fd00::/8 (ULA), unspecified ::
    if (normalized === '::1' || normalized === '::' || normalized === '::ffff:127.0.0.1') {
      return true;
    }
    if (normalized.startsWith('fe80:') || normalized.startsWith('fd') || normalized.startsWith('fc')) {
      return true;
    }
    // IPv4-mapped addresses
    const mapped = normalized.split('::ffff:')[1];
    if (mapped && net.isIPv4(mapped)) return isPrivateIp(mapped);
  }
  return false;
}

/** Validate a bare domain string (no scheme, no path, no IP literal). */
export function validateDomain(domain: string): string {
  const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:.*$/, '');
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(cleaned)) {
    throw ApiError.badRequest('Invalid domain. Use a bare domain like example.org (no protocol/path).', 'domain');
  }
  if (net.isIP(cleaned)) {
    throw ApiError.badRequest('Domain must not be an IP address.', 'domain');
  }
  if (cleaned.length > 253) {
    throw ApiError.badRequest('Domain is too long.', 'domain');
  }
  return cleaned;
}

/** Reject SSRF: ensure every resolved address for the host is public. */
export async function assertPublicHost(hostname: string): Promise<void> {
  let addresses: string[];
  try {
    const result = await dns.lookup(hostname, { all: true });
    addresses = result.map((r) => r.address);
  } catch {
    throw ApiError.badRequest(`Could not resolve domain: ${hostname}`);
  }
  if (addresses.length === 0) {
    throw ApiError.badRequest(`Could not resolve domain: ${hostname}`);
  }
  const privateOnes = addresses.filter(isPrivateIp);
  if (privateOnes.length > 0) {
    throw ApiError.badRequest('Domain resolves to a private/loopback address and cannot be verified.');
  }
}

/** Fetch a remote URL with SSRF protection, redirect limit and size cap. */
export async function safeFetch(
  url: string,
  opts: { timeoutMs?: number; maxBytes?: number; maxRedirects?: number } = {},
): Promise<{ status: number; body: string; finalUrl: string }> {
  const timeoutMs = opts.timeoutMs ?? 10_000;
  const maxBytes = opts.maxBytes ?? 1_000_000;
  const maxRedirects = opts.maxRedirects ?? 3;

  let current = url;
  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      throw ApiError.badRequest(`Invalid URL: ${current}`);
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw ApiError.badRequest(`Unsupported protocol: ${parsed.protocol}`);
    }
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      throw ApiError.badRequest('Only ports 80 and 443 are allowed.');
    }
    if (net.isIP(parsed.hostname)) {
      throw ApiError.badRequest('URL host must not be an IP address.');
    }
    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(current, {
        redirect: 'manual',
        signal: controller.signal,
        headers: { 'user-agent': 'WebCrm-Verify/1.0', accept: 'text/html,text/plain,*/*' },
      });
    } catch (error) {
      throw ApiError.badRequest(
        `Could not fetch ${current}: ${error instanceof Error ? error.message : 'network error'}`,
      );
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw ApiError.badRequest(`Redirect without location at ${current}`);
      current = new URL(location, current).toString();
      continue;
    }

    const contentLength = Number(res.headers.get('content-length') ?? '0');
    if (contentLength > maxBytes) {
      throw ApiError.badRequest('Response body too large.');
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > maxBytes) {
      throw ApiError.badRequest('Response body too large.');
    }

    return { status: res.status, body: buffer.toString('utf8'), finalUrl: current };
  }

  throw ApiError.badRequest('Too many redirects.');
}

/** Like safeFetch but returns raw bytes (for image download). */
export async function safeFetchBuffer(
  url: string,
  opts: { timeoutMs?: number; maxBytes?: number; maxRedirects?: number } = {},
): Promise<{ status: number; buffer: Buffer; finalUrl: string; contentType: string | null }> {
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const maxBytes = opts.maxBytes ?? 10_000_000;
  const maxRedirects = opts.maxRedirects ?? 3;

  let current = url;
  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      throw ApiError.badRequest(`Invalid URL: ${current}`);
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw ApiError.badRequest(`Unsupported protocol: ${parsed.protocol}`);
    }
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      throw ApiError.badRequest('Only ports 80 and 443 are allowed.');
    }
    if (net.isIP(parsed.hostname)) {
      throw ApiError.badRequest('URL host must not be an IP address.');
    }
    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(current, {
        redirect: 'manual',
        signal: controller.signal,
        headers: { 'user-agent': 'WebCrm-Import/1.0', accept: '*/*' },
      });
    } catch (error) {
      throw ApiError.badRequest(
        `Could not fetch ${current}: ${error instanceof Error ? error.message : 'network error'}`,
      );
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw ApiError.badRequest(`Redirect without location at ${current}`);
      current = new URL(location, current).toString();
      continue;
    }

    const contentLength = Number(res.headers.get('content-length') ?? '0');
    if (contentLength > maxBytes) {
      throw ApiError.badRequest('Response body too large.');
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > maxBytes) {
      throw ApiError.badRequest('Response body too large.');
    }

    return {
      status: res.status,
      buffer,
      finalUrl: current,
      contentType: res.headers.get('content-type'),
    };
  }

  throw ApiError.badRequest('Too many redirects.');
}
