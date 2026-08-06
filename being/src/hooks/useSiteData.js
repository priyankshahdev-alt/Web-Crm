// Loads the WebCrm site payload once (module-level cache) so Navbar, Footer
// and every page share a single fetch, then re-fetches periodically so content
// saved in the WebCrm panel appears on the site without a manual refresh.
// Returns { site, loading }; `site` is null when the backend is not configured
// or unreachable (static fallback). Failed refreshes keep the last good data.
import { useEffect, useState } from 'react';
import { fetchSite } from '../api/client';

const REFRESH_INTERVAL_MS = 30000;

const cached = { site: undefined };
let inflight = null;

async function fetchLatest() {
  const data = await fetchSite();
  if (data !== null) cached.site = data;
  return cached.site;
}

function loadSite() {
  if (cached.site !== undefined) return Promise.resolve(cached.site);
  if (!inflight) {
    inflight = fetchLatest().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export function useSiteData() {
  const [site, setSite] = useState(cached.site);
  const [loading, setLoading] = useState(cached.site === undefined);

  useEffect(() => {
    let mounted = true;
    let timer = null;

    loadSite().then((data) => {
      if (mounted) {
        setSite(data);
        setLoading(false);
      }
    });

    timer = setInterval(async () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const data = await fetchSite();
        if (data !== null && mounted) {
          setSite(data);
          setLoading(false);
        }
      } catch {
        // keep last good data on failure
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  return { site, loading };
}
