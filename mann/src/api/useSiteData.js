// =============================================
// useSiteData – sab pages ka data yahan se aata hai.
// Backend off hai to static data (src/data) use hota hai.
// Backend on hai (VITE_API_URL + VITE_SITE_SLUG set) to API se fetch hota hai
// aur live content static data ke upar overlay hota hai.
// =============================================
import { useEffect, useState } from "react";
import { isApiMode } from "../config";
import { getSite } from "./client";
import { slides, stats, initiatives, activities, getInvolved, causes, partners, contact } from "../data/site";
import { projects, gallerySections, team, homeProjects } from "../data/projects";

const staticData = {
  slides, stats, initiatives, activities, getInvolved, causes, partners, contact,
  projects, gallerySections, team, homeProjects,
};

function findSection(page, type) {
  return (page?.sections || []).find((s) => s.type === type);
}

function mapSlides(sliders) {
  const raw = (sliders || []).flatMap((s) => s.slides || []);
  if (!raw.length) return null;
  const mapped = raw
    .filter((sl) => sl.imageUrl)
    .map((sl) => ({
      desktop: sl.imageUrl,
      mobile: sl.mobileImageUrl || sl.imageUrl,
      alt: sl.altText || sl.title || "",
      cta: sl.link || sl.content?.primaryCta?.url || "/get-involved/donate-online",
    }));
  return mapped.length ? mapped : null;
}

function mapStats(page) {
  const section = findSection(page, "stats");
  const items = (section?.content?.items || []).filter((it) => it && (it.value || it.label));
  if (!items.length) return null;
  return items.map((it) => ({ value: it.value, label: it.label }));
}

function mapContact(settings, fallback) {
  const phone = settings["contact.phone"] || "";
  const whatsapp = settings["whatsapp.number"] || "";
  return {
    address: settings["contact.address"] || fallback.address,
    phones: phone ? [phone] : fallback.phones,
    emails: settings["contact.email"] ? [settings["contact.email"]] : fallback.emails,
    whatsapp: whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}` : fallback.whatsapp,
    instagram: settings["social.instagram"] || fallback.instagram,
    gpayQr: fallback.gpayQr,
  };
}

export function useSiteData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(isApiMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isApiMode) {
      setData(staticData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const site = await getSite();
        if (cancelled) return;
        if (!site) {
          setData(staticData);
          return;
        }
        const home = (site.pages || []).find((p) => p.isHome || p.slug === "home");
        const settings = site.settings || {};
        setData({
          ...staticData,
          slides: mapSlides(site.sliders) || staticData.slides,
          stats: mapStats(home) || staticData.stats,
          contact: mapContact(settings, staticData.contact),
          site,
        });
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data: data || staticData, loading, error };
}
