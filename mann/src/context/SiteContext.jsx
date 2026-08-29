import { createContext, useContext, useMemo } from "react";
import { useSiteData } from "../api/useSiteData";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const { data, site, loading } = useSiteData();

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

    return {
      data,
      site,
      loading,
      isLive: Boolean(site),
      settings,
      getSetting: (key, fallback = "") =>
        settings && settings[key] != null ? settings[key] : fallback,
      getPage,
      getSection,
      getMenu,
    };
  }, [data, site, loading]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
