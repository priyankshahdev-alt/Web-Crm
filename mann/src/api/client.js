// =============================================
// Minimal fetch wrapper.
// Endpoints config.js me base sahit complete path dete hain,
// isliye yahan sirf fetch kiya jata hai.
// =============================================
import { API_URL, SITE_SLUG } from "../config";

export async function getJSON(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Public site payload: GET /site/:slug → { success, message, data }.
// Returns null (static fallback) when not configured or unreachable.
export async function getSite() {
  if (!API_URL || !SITE_SLUG) return null;
  try {
    const payload = await getJSON(`/site/${encodeURIComponent(SITE_SLUG)}`);
    return payload && payload.success !== false ? (payload.data ?? null) : null;
  } catch {
    return null;
  }
}
