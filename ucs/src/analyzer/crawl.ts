import { toAbsolute, sameOrigin, pageSlugFromUrl, normalizeUrl } from '../util.js';

export interface FetchedPage {
  url: string;
  html: string;
}

const USER_AGENT = 'Mozilla/5.0 (compatible; WebCrm-UCS/0.1)';

export async function fetchHtml(url: string, timeoutMs = 15000): Promise<FetchedPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'user-agent': USER_AGENT },
      signal: controller.signal,
      redirect: 'follow',
    });
  } catch (error) {
    throw new Error(
      `Could not fetch ${url}: ${error instanceof Error ? error.message : 'network error'}`,
    );
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    throw new Error(`GET ${url} returned HTTP ${res.status}`);
  }
  const html = await res.text();
  if (!html) throw new Error(`Empty response from ${url}`);
  return { url: res.url || url, html };
}

/** Collect same-origin, navigable page links from a DOM string. */
export function extractPageLinks(
  baseUrl: string,
  html: string,
  includePath?: string,
): string[] {
  const links = new Set<string>();
  const hrefRe = /<a[^>]+href=["']([^"'#]+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = hrefRe.exec(html)) !== null) {
    const href = match[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    const abs = toAbsolute(baseUrl, href);
    if (!abs) continue;
    if (!sameOrigin(abs, baseUrl)) continue;
    const url = new URL(abs);
    url.hash = '';
    url.search = '';
    if (includePath && !url.pathname.startsWith(includePath)) continue;
    links.add(normalizeUrl(url.toString()));
  }
  return [...links];
}

export async function crawlSite(
  baseUrl: string,
  opts: { maxPages?: number; includePath?: string } = {},
): Promise<FetchedPage[]> {
  const maxPages = opts.maxPages ?? 15;
  const pages: FetchedPage[] = [];
  const visited = new Set<string>();
  const queue: string[] = [baseUrl];

  while (queue.length > 0 && pages.length < maxPages) {
    const current = queue.shift()!;
    const key = normalizeUrl(current);
    if (visited.has(key)) continue;
    visited.add(key);

    let page: FetchedPage;
    try {
      page = await fetchHtml(key);
    } catch {
      continue;
    }
    pages.push(page);

    if (pages.length >= maxPages) break;

    for (const link of extractPageLinks(page.url || key, page.html, opts.includePath)) {
      if (!visited.has(link)) queue.push(link);
    }
  }

  return pages.sort((a, b) => {
    const aHome = pageSlugFromUrl(a.url, baseUrl) === 'home' ? 0 : 1;
    const bHome = pageSlugFromUrl(b.url, baseUrl) === 'home' ? 0 : 1;
    return aHome - bHome;
  });
}
