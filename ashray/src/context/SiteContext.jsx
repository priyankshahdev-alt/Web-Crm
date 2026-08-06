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
