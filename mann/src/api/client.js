// =============================================
// Minimal fetch wrapper.
// Endpoints config.js me base sahit complete path dete hain,
// isliye yahan sirf fetch kiya jata hai.
// =============================================
export async function getJSON(endpoint, options = {}) {
  const res = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
