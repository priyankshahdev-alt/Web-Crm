export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function toAbsolute(base: string, href: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

export function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

/** Normalize a URL for dedupe/slug purposes: drop hash/search, collapse
 *  `index.html` segments and trailing slashes. */
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = '';
    u.search = '';
    let path = u.pathname;
    if (/\/index\.html?$/i.test(path)) path = path.replace(/\/index\.html?$/i, '/');
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    u.pathname = path;
    return u.toString();
  } catch {
    return url;
  }
}

export function pageSlugFromUrl(url: string, _baseUrl: string): string {
  try {
    const u = new URL(normalizeUrl(url));
    let path = u.pathname;
    if (path.endsWith('/')) path = path.slice(0, -1);
    if (path === '') return 'home';
    const last = path.split('/').pop() ?? '';
    const cleaned = last.replace(/\.(html?|php|aspx?)$/i, '');
    if (cleaned) return slugify(decodeURIComponent(cleaned));
    return 'home';
  } catch {
    return 'home';
  }
}

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractEmail(text: string): string | null {
  const match = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return match ? match[0] : null;
}

export function extractPhone(text: string): string | null {
  const match = text.match(/(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4,}/);
  return match ? match[0].trim() : null;
}

export function truncate(value: string, max = 200): string {
  return value.length > max ? `${value.slice(0, max).trimEnd()}\u2026` : value;
}
