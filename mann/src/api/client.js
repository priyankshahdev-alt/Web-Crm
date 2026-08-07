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
// Module-level "last good" cache: Navbar/Footer/Home sab ek hi payload share
// karte hain. getSite(force=true) fresh fetch karta hai (useSiteData 30s
// polling) taaki CMS edits bina manual refresh ke public site par live ho.
// Failed refreshes last good data hi rakhte hain — UI kabhi blank nahi hota.
let lastGood = null;
let inflight = null;

export function getSite(force = false) {
  if (!API_URL || !SITE_SLUG) return Promise.resolve(null);
  if (!force && lastGood !== null) return Promise.resolve(lastGood);
  if (!force && inflight) return inflight;
  inflight = (async () => {
    try {
      const payload = await getJSON(`/site/${encodeURIComponent(SITE_SLUG)}`);
      const data = payload && payload.success !== false ? (payload.data ?? null) : null;
      if (data !== null) lastGood = data;
      return data;
    } catch {
      return lastGood;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
