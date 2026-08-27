// Loads the WebCrm site payload once (module-level cache) so Navbar, Footer
// and every page share a single fetch, then re-fetches periodically so content
// saved in the WebCrm panel appears on the site without a manual refresh.
// Returns { site, loading }; `site` is null only when no real data has ever
// been fetched. Failed refreshes keep the last successful real data from
// memory AND localStorage (per spec: do NOT fallback to mock/hardcoded on
// API failure, preserve last successful and reconnect automatically).
import { useEffect, useState } from 'react';
import { fetchSite } from '../api/client';

const REFRESH_INTERVAL_MS = 30000;
const LS_KEY = 'being:site:being-sevak';

function readLastSuccessful() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return undefined;
}

function writeLastSuccessful(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

const cached = { site: readLastSuccessful() };
let inflight = null;

async function fetchLatest() {
  const data = await fetchSite();
  if (data !== null) {
    cached.site = data;
    writeLastSuccessful(data);
  } else if (cached.site === undefined) {
    // No last successful yet - keep undefined so caller can decide fallback
    // Do NOT inject mock/hardcoded here
  }
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
        const data = await fetchLatest();
        if (data !== undefined && data !== null && mounted) {
          setSite(data);
          setLoading(false);
        }
      } catch {
        // keep last good data on failure, auto-reconnect on next interval
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  return { site, loading };
}
