// =============================================
// Environment config
// VITE_API_URL (full API base, e.g. /api/v1) set karne par frontend
// backend se data fetch karega. Empty rahega to static/mock data
// (src/data) use hota hai. Default base /api/v1 (dev proxy / build).
// =============================================
const API_BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

export const API_URL = API_BASE;
export const isApiMode = Boolean(import.meta.env.VITE_API_URL);
export const SITE_SLUG = "mann";

export const API_ENDPOINTS = {
  site: `${API_BASE}/site/${SITE_SLUG}`,
};
