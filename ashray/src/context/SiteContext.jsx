// SiteContext — exposes the live WebCrm site payload + settings helpers.
// isLive is true when the backend payload loaded; otherwise components keep
// their hardcoded static content.
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useSiteData } from '../hooks/useSiteData';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const { site, loading } = useSiteData();

  useEffect(() => {
    if (!site) return;
    const settings = site.settings ?? {};
    const name = site.organization?.name || settings['site.siteName'];
    const tagline = settings['site.tagline'] || settings['site.description'];
    if (name) document.title = tagline ? `${name} — ${tagline}` : name;
    if (settings['site.description'] && !document.querySelector('meta[name="description"]')) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = settings['site.description'];
      document.head.appendChild(meta);
    }
  }, [site]);

  const value = useMemo(() => {
    const settings = site?.settings ?? null;
    return {
      site,
      loading,
      isLive: Boolean(site),
      settings,
      getSetting: (key, fallback = '') =>
        settings && settings[key] != null ? settings[key] : fallback,
    };
  }, [site, loading]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSite } from '../lib/site';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSite({ force: true });
      setSite(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSite();
        if (!cancelled) setSite(data);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ site, loading, error, refresh }),
    [site, loading, error, refresh],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within a SiteProvider');
  return ctx;
}
