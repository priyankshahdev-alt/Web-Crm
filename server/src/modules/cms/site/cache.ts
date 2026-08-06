const TTL_MS = 5_000;

interface CacheEntry {
  at: number;
  data: unknown;
}

const cache = new Map<string, CacheEntry>();

/**
 * Short-lived in-memory cache for the public `GET /site/:slug` payload.
 * Keeps the public site fast under load while still going live within the
 * TTL after a web user saves content.
 */
export const siteCache = {
  get(slug: string): unknown | undefined {
    const entry = cache.get(slug);
    if (!entry) return undefined;
    if (Date.now() - entry.at > TTL_MS) {
      cache.delete(slug);
      return undefined;
    }
    return entry.data;
  },

  set(slug: string, data: unknown): void {
    cache.set(slug, { at: Date.now(), data });
  },

  invalidate(slug: string): void {
    cache.delete(slug);
  },

  clear(): void {
    cache.clear();
  },
};
