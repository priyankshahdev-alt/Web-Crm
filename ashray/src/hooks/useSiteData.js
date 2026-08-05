// Loads the WebCrm site payload once (module-level cache) so Navbar, Footer
// and every page share a single fetch. Returns { site, loading }; `site` is
// null when the backend is not configured or unreachable (static fallback).
import { useEffect, useState } from 'react';
import { fetchSite } from '../api/client';

const cached = { site: undefined };

async function loadSite() {
  if (cached.site !== undefined) return cached.site;
  const site = await fetchSite();
  cached.site = site;
  return site;
}

export function useSiteData() {
  const [site, setSite] = useState(cached.site);
  const [loading, setLoading] = useState(cached.site === undefined);

  useEffect(() => {
    let mounted = true;
    loadSite().then((data) => {
      if (mounted) {
        setSite(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { site, loading };
}
