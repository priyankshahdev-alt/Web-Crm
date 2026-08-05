interface CacheEntry<T> {
  promise: Promise<T>
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

/**
 * Memoize an async loader for `ttlMs`, deduplicating concurrent calls and
 * caching across component mounts (e.g. sidebar badge + page both loading
 * the same list). On failure the entry is evicted so the next call retries.
 */
export function withCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const now = Date.now()
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (entry && entry.expiresAt > now) {
    return entry.promise
  }
  const promise = loader()
  store.set(key, { promise, expiresAt: now + ttlMs })
  promise.catch(() => {
    if (store.get(key)?.promise === promise) store.delete(key)
  })
  return promise
}

/** Drop a cached entry (or everything) so the next call refetches. */
export function invalidate(key?: string): void {
  if (key) store.delete(key)
  else store.clear()
}
