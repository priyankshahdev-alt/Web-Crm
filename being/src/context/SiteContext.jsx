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
    const pages = site?.pages ?? [];
    const menus = site?.menus ?? [];

    const getPage = (slug) => pages.find((p) => p.slug === slug) || null;

    const getMenu = (location) =>
      menus.find((m) => m.location === location && (m.items || []).length > 0) || null;

    const getSection = (pageSlug, type) => {
      const page = getPage(pageSlug);
      if (!page) return null;
      return (
        (page.sections || []).find(
          (s) => s.type === type && s.isActive !== false,
        ) || null
      );
    };

    const getSlides = () => {
      const out = [];
      for (const slider of site?.sliders ?? []) {
        if (slider.isActive === false) continue;
        for (const slide of slider.slides ?? []) {
          if (slide.isActive === false || !slide.imageUrl) continue;
          out.push(slide);
        }
      }
      return out;
    };

    const getStats = () => {
      const section = getSection('home', 'stats');
      const items = section?.content?.items;
      return Array.isArray(items) && items.length ? items : null;
    };

    const getLocations = () =>
      (site?.locations ?? []).filter((l) => l.isActive !== false);

    return {
      site,
      loading,
      isLive: Boolean(site),
      settings,
      getSetting: (key, fallback = '') =>
        settings && settings[key] != null ? settings[key] : fallback,
      getPage,
      getSection,
      getMenu,
      getSlides,
      getStats,
      getLocations,
    };
  }, [site, loading]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
