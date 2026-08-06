// =============================================
// useSiteData – sab pages ka data yahan se aata hai.
// API mode on hai (VITE_API_URL set) to /api/v1/site/mann se live
// data fetch hota hai (sections + entities DB se), baki keys static
// data (src/data) se merge hote hain. API fail ho to bina tode
// static data par fallback ho jata hai.
// =============================================
import { useEffect, useState } from "react";
import { isApiMode, API_ENDPOINTS } from "../config";
import { getJSON } from "./client";
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

function getHomeSections(site) {
  const pages = site?.pages ?? [];
  const home = pages.find((p) => p.isHome) ?? pages[0];
  const byType = {};
  for (const s of home?.sections ?? []) byType[s.type] = s;
  return byType;
}

function mapSlides(section) {
  return (section?.content?.slides ?? []).map((s, i) => ({
    id: s.id ?? i,
    desktop: img(s.imageUrl),
    mobile: img(s.mobileImageUrl || s.imageUrl),
    alt: s.altText || s.title || "",
    cta: s.ctaUrl || "/",
  }));
}

function mapStats(section) {
  return (section?.content?.items ?? []).map((it) => ({ value: it.value, label: it.label }));
}

function mapInitiatives(section) {
  return (section?.content?.projects ?? []).map((p, i) => ({
    num: String(i + 1).padStart(2, "0"),
    slug: (p.url || "").replace(/^\/projects\//, "") || (p.title || "").toLowerCase().replace(/\s+/g, "-"),
    name: (p.title || "").toUpperCase(),
    icon: "handshake",
    image: img(p.image),
    text: p.description || "",
    bg: "bg-surface-container-low",
  }));
}

function mapActivities(section) {
  const images = Array.isArray(section?.content?.images)
    ? section.content.images
    : (section?.entities?.[0]?.items ?? []).map((it) => it.imageUrl);
  return images.map((image) => ({ image: img(image), caption: "" }));
}

function mapContact(site) {
  const org = site?.organization ?? {};
  const s = site?.settings ?? {};
  const split = (v) => (v ? String(v).split(",").map((x) => x.trim()).filter(Boolean) : []);
  const phones = split(s["contact.phone"] ?? org.phone);
  const emails = split(s["contact.email"] ?? org.email);
  return {
    address: s["contact.address"] ?? org.address ?? "",
    phones: phones.length ? phones : [org.phone].filter(Boolean),
    emails: emails.length ? emails : [org.email].filter(Boolean),
    gpayQr: img(s["payment.qrUrl"] || "/gpay-qr.jpeg"),
    whatsapp: s["whatsapp.number"] || "",
    instagram: s["social.instagram"] || "",
    facebook: s["social.facebook"] || "",
    youtube: s["social.youtube"] || "",
  };
}

function mapSiteData(site) {
  const secs = getHomeSections(site);
  return {
    slides: mapSlides(secs["hero-slider"]),
    stats: mapStats(secs.stats),
    initiatives: mapInitiatives(secs["projects-grid"]),
    activities: mapActivities(secs.gallery),
    contact: mapContact(site),
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
        const json = await getJSON(API_ENDPOINTS.site);
        if (cancelled) return;
        const site = json?.data ?? json;
        setData({ ...staticData, ...mapSiteData(site) });
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
