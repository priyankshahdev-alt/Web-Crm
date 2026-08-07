// =============================================
// useSiteData – sab pages ka data yahan se aata hai.
// Backend off hai to static data (src/data) use hota hai.
// Backend on hai (VITE_API_URL + VITE_SITE_SLUG set) to API se fetch hota hai
// aur live content static data ke upar overlay hota hai.
// Home ke hero-slider / stats / projects-grid / gallery sections, nav (menus)
// aur footer (settings + footer menu) DB se map hote hain; baki keys
// (get-involved, causes, partners, project detail pages, media) abhi static
// data se aati hain — jahan DB ka koi map nahi hai.
// =============================================
import { useEffect, useState } from "react";
import { isApiMode } from "../config";
import { getSite } from "./client";
import { img } from "../utils/images";
import {
  slides, stats, initiatives, activities, getInvolved, causes, partners, contact,
  navMenu, footer,
} from "../data/site";
import { projects, gallerySections, team, homeProjects } from "../data/projects";

const staticData = {
  slides, stats, initiatives, activities, getInvolved, causes, partners, contact,
  navMenu, footer,
  projects, gallerySections, team, homeProjects,
};

function findSection(page, type) {
  return (page?.sections || []).find((s) => s.type === type);
}

// CMS menu URLs -> is app ke valid React routes.
const NAV_ALIASES = {
  "/": "/",
  "/about": "/about/our-story",
  "/projects": "/projects/poshan",
  "/gallery": "/media",
  "/documents": "/about/legal-certificate",
  "/contact": "/contact/get-in-touch",
  "/donate": "/get-involved/donate-online",
};

function validNavUrl(url) {
  if (!url) return null;
  return NAV_ALIASES[url] || url;
}

function mapSlides(page) {
  const section = findSection(page, "hero-slider");
  const raw = (section?.content?.slides || []).filter(
    (sl) => sl && (sl.imageUrl || sl.mobileImageUrl || sl.title || sl.accent),
  );
  if (!raw.length) return null;
  return raw.map((sl, i) => {
    const fallback = staticData.slides[i] || {};
    const fallbackImg = fallback.desktop || staticData.slides[0]?.desktop || null;
    return {
      desktop: img(sl.imageUrl) || fallbackImg,
      mobile: img(sl.mobileImageUrl || sl.imageUrl) || fallback.mobile || fallbackImg,
      alt: sl.altText || sl.title || fallback.alt || "",
      cta: sl.ctaUrl || fallback.cta || "/",
      eyebrow: sl.eyebrow || "",
      title: sl.title || "",
      accent: sl.accent || "",
      subtitle: sl.subtitle || "",
      ctaLabel: sl.ctaLabel || "",
    };
  });
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

function mapNav(site) {
  const menu = (site.menus || []).find((m) => m.location === "main-nav");
  const items = (menu?.items || []).filter((it) => it && it.label);
  if (!items.length) return null;
  const mapped = items.map((item) => {
    const label = item.label || "";
    const staticItem = staticData.navMenu.find((f) => {
      const a = f.label.toLowerCase();
      const b = label.toLowerCase();
      return a === b || a.includes(b) || b.includes(a);
    });
    // Matching parent with dropdown -> static children (valid routes) preserve design.
    if (staticItem?.children?.length) return { label, children: staticItem.children };
    const to = validNavUrl(item.url);
    if (to) return { label, to };
    return staticItem ? { label: staticItem.label, to: staticItem.to } : null;
  }).filter(Boolean);
  return mapped.length ? mapped : null;
}

function mapFooter(site) {
  const settings = site.settings || {};
  const menu = (site.menus || []).find((m) => m.location === "footer");
  const programs = (menu?.items || [])
    .map((it) => {
      const to = validNavUrl(it.url);
      return to ? { label: it.label, to } : null;
    })
    .filter(Boolean);
  return {
    tagline: settings["footer.tagline"] || staticData.footer.tagline,
    copyright: settings["footer.copyright"] || staticData.footer.copyright,
    programs: programs.length ? programs : staticData.footer.programs,
    legal: staticData.footer.legal,
  };
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

// =============================================
// Shared live site store.
// Home / Navbar / Footer sab isi hook se data lete hain. Ek hi module-level
// store + 30s polling interval sab components ke liye chalta hai (ek request),
// taaki CMS panel me save hote hi content bina manual refresh ke public site
// par live ho jaye. Failed refreshes last good data rakhti hain.
// =============================================
const REFRESH_INTERVAL_MS = 30000;
let shared = null;
let listeners = new Set();
let pollTimer = null;

function emit() {
  if (!shared) return;
  const snap = shared;
  listeners.forEach((fn) => fn(snap));
}

function buildData(site) {
  const home = (site.pages || []).find((p) => p.isHome || p.slug === "home");
  const settings = site.settings || {};
  return {
    ...staticData,
    slides: mapSlides(home) || staticData.slides,
    stats: mapStats(home) || staticData.stats,
    initiatives: mapInitiatives(home) || staticData.initiatives,
    activities: mapActivities(home) || staticData.activities,
    navMenu: mapNav(site) || staticData.navMenu,
    footer: mapFooter(site),
    contact: mapContact(settings, staticData.contact),
    site,
  };
}

async function apply(force) {
  const site = await getSite(force);
  shared = site
    ? { data: buildData(site), loading: false, error: null }
    : { data: shared?.data || staticData, loading: false, error: null };
  emit();
}

function ensurePolling() {
  if (pollTimer) return;
  pollTimer = setInterval(() => {
    if (document.visibilityState !== "hidden") apply(true);
  }, REFRESH_INTERVAL_MS);
}

export function useSiteData() {
  const [current, setCurrent] = useState(() =>
    shared || { data: staticData, loading: isApiMode, error: null },
  );

  useEffect(() => {
    if (!isApiMode) {
      shared = { data: staticData, loading: false, error: null };
      setCurrent(shared);
      return;
    }
    listeners.add(setCurrent);
    setCurrent(shared || { data: staticData, loading: true, error: null });
    if (!shared) {
      shared = { data: staticData, loading: true, error: null };
      apply(false);
    }
    ensurePolling();
    return () => {
      listeners.delete(setCurrent);
    };
  }, []);

  return current;
}
