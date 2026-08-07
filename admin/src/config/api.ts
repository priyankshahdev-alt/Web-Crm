/**
 * Base URL for the backend API.
 *
 * Defaults to a relative `/api/v1` so the dev proxy (vite.config.ts →
 * http://localhost:4000) and a production reverse proxy can both serve it.
 * Override at build time with `VITE_API_URL` (e.g. point at a local server
 * during development).
 */
export const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'
