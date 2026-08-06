// =============================================
// useSiteData – sab pages ka data yahan se aata hai.
// Backend off hai to static data (src/data) use hota hai.
// Backend on hai (VITE_API_URL + VITE_SITE_SLUG set) to API se fetch hota hai
// aur live content static data ke upar overlay hota hai.
// Home ke hero-slider / stats / projects-grid / gallery sections DB se
// map hote hain; baki keys (nav, footer, get-involved, causes, partners,
// project detail pages, media) abhi static data se aati hain.
// =============================================
import { useEffect, useState } from "react";
import { isApiMode } from "../config";
import { getSite } from "./client";
import { img } from "../utils/images";
import {
  slides, stats, initiatives, activities, getInvolved, causes, partners, contact,
  navMenu, footerPrograms, footerLegal,
} from "../data/site";
import { projects, gallerySections, team, homeProjects } from "../data/projects";

const staticData = {
  slides, stats, initiatives, activities, getInvolved, causes, partners, contact,
  navMenu, footerPrograms, footerLegal,
  projects, gallerySections, team, homeProjects,
};

function findSection(page, type) {
  return (page?.sections || []).find((s) => s.type === type);
}

function mapSlides(page) {
  const section = findSection(page, "hero-slider");
  const raw = section?.content?.slides || [];
  if (!raw.length) return null;
  const mapped = raw
    .filter((sl) => sl.imageUrl)
    .map((sl) => ({
      desktop: img(sl.imageUrl),
      mobile: img(sl.mobileImageUrl || sl.imageUrl),
      alt: sl.altText || sl.title || "",
      cta: sl.ctaUrl || "/",
    }));
  return mapped.length ? mapped : null;
}

function mapStats(page) {
  const section = findSection(page, "stats");
  const items = (section?.content?.items || []).filter((it) => it && (it.value || it.label));
  if (!items.length) return null;
  return items.map((it) => ({ value: it.value, label: it.label }));
}

function mapInitiatives(page) {
  const section = findSection(page, "projects-grid");
  const list = section?.content?.projects || [];
  if (!list.length) return null;
  return list.map((p, i) => ({
    num: String(i + 1).padStart(2, "0"),
    slug: (p.url || "").replace(/^\/projects\//, "") || (p.title || "").toLowerCase().replace(/\s+/g, "-"),
    name: (p.title || "").toUpperCase(),
    icon: "handshake",
    image: img(p.image),
    text: p.description || "",
    bg: "bg-surface-container-low",
  }));
}

function mapActivities(page) {
  const section = findSection(page, "gallery");
  const images = Array.isArray(section?.content?.images)
    ? section.content.images
    : (section?.entities?.[0]?.items || []).map((it) => it.imageUrl);
  if (!images.length) return null;
  return images.map((image) => ({ image: img(image), caption: "" }));
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
          slides: mapSlides(home) || staticData.slides,
          stats: mapStats(home) || staticData.stats,
          initiatives: mapInitiatives(home) || staticData.initiatives,
          activities: mapActivities(home) || staticData.activities,
          contact: mapContact(settings, staticData.contact),
          site,
        });
      } catch (e) {
        if (!cancelled) setError(e);
        if (!cancelled) setData(staticData);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data: data || staticData, loading, error };
}
