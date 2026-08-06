const API_BASE = import.meta.env.VITE_SITE_API_URL || '/api/v1';
export const SITE_SLUG = 'ashray';

let cached = null;

export async function fetchSite({ force = false } = {}) {
  if (cached && !force) return cached;
  const res = await fetch(`${API_BASE}/site/${SITE_SLUG}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Site API responded with ${res.status}`);
  }
  const json = await res.json();
  cached = json?.data ?? json;
  return cached;
}

export function getPage(site, slug) {
  const list = site?.pages ?? [];
  if (slug) {
    const match = list.find((p) => p.slug === slug);
    if (match) return match;
  }
  return list.find((p) => p.isHome) ?? list[0] ?? null;
}

export function getSection(site, type, pageSlug) {
  const page = getPage(site, pageSlug);
  if (!page) return null;
  return page.sections?.find((s) => s.type === type) ?? null;
}

export function getMenu(site, location) {
  return site?.menus?.find((m) => m.location === location) ?? null;
}

export function getSetting(site, key, fallback = '') {
  const value = site?.settings?.[key];
  return value == null || value === '' ? fallback : value;
}

export function isNonEmptyImage(value) {
  return typeof value === 'string' && value.trim() !== '';
}
