/**
 * Base URL for the backend API.
 *
 * Defaults to a relative `/api/v1` so the dev proxy (vite.config.ts →
 * http://localhost:4000) and a production reverse proxy can both serve it.
 * This keeps the Master Panel on the SAME backend (and therefore the same
 * database) as the Admin Panel. Override at build time with `VITE_API_URL`
 * (e.g. point at a deployed backend during development).
 */
export const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

/**
 * Where the admin panel lives. The master's "Log in as admin" opens this URL
 * with a one-time ticket (`?ticket=...`) which the admin panel exchanges for a
 * session. Override at build time with `VITE_ADMIN_URL`.
 */
export const ADMIN_PANEL_URL =
  import.meta.env.VITE_ADMIN_URL || 'http://localhost:5175'
