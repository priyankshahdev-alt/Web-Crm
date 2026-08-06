// Live WebCrm site data client.
// When VITE_API_URL + VITE_SITE_SLUG are set, GET /site/:slug is fetched and
// its `data` payload returned. Any failure (offline, 4xx/5xx, timeout) or
// missing config returns null so the app falls back to static content.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const SITE_SLUG = import.meta.env.VITE_SITE_SLUG || '';

export async function fetchSite() {
  if (!API_URL || !SITE_SLUG) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${API_URL}/site/${encodeURIComponent(SITE_SLUG)}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload && payload.success !== false ? (payload.data ?? null) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
