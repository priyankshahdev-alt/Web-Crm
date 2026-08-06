// =============================================
// Environment config
// VITE_API_URL + VITE_SITE_SLUG set karne par frontend backend se data fetch
// karega. Empty rahega to static/mock data use hota hai.
// =============================================
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const SITE_SLUG = import.meta.env.VITE_SITE_SLUG || "";

export const isApiMode = Boolean(API_URL && SITE_SLUG);
export { API_URL };

export const API_ENDPOINTS = {
  site: `${API_URL}/site/${encodeURIComponent(SITE_SLUG)}`,
  projects: `${API_URL}/projects`,
  project: (slug) => `${API_URL}/projects/${slug}`,
  gallery: `${API_URL}/galleries`,
  team: `${API_URL}/team`,
};
