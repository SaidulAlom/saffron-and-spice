import { useState, useEffect, useRef } from 'react';

interface UseSupabaseResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

// Module-level cache: fetcher function → cached result.
// Lives for the lifetime of the browser session so navigating
// back to a page shows data immediately instead of re-fetching.
const cache = new Map<Function, unknown>();

/**
 * Imperatively warm the cache for a fetcher without mounting a component.
 * Call this on nav-link hover so data is ready before the route transition.
 *
 * @example
 *   <Link to="/menu" onMouseEnter={() => prefetch(fetchMenuItems)}>
 */
export function prefetch<T>(fetcher: () => Promise<T>): void {
  if (cache.has(fetcher)) return; // already cached
  fetcher().then(result => cache.set(fetcher, result)).catch(() => {
    /* silently ignore prefetch errors — the hook will handle errors on mount */
  });
}

export function useSupabase<T>(fetcher: () => Promise<T>): UseSupabaseResult<T> {
  const [data, setData] = useState<T | null>(() => (cache.get(fetcher) as T) ?? null);
  const [loading, setLoading] = useState(!cache.has(fetcher));
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    // If we have a cached result and this is the first mount (attempt === 0),
    // skip the network call entirely.
    if (attempt === 0 && cache.has(fetcherRef.current)) {
      setData(cache.get(fetcherRef.current) as T);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    // Don't clear `data` — keep showing stale data while refreshing
    // so the page never goes blank.

    fetcherRef.current()
      .then(result => {
        if (!cancelled) {
          cache.set(fetcherRef.current, result);
          setData(result);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? 'Failed to load data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [attempt]);

  return {
    data,
    loading,
    error,
    retry: () => {
      // Clear the cache entry so we re-fetch fresh data on retry.
      cache.delete(fetcherRef.current);
      setAttempt(prev => prev + 1);
    },
  };
}
