/**
 * Base URL for the backend API.
 *
 * Defaults to the hosted backend so the panel works without a local server.
 * Override at build time with `VITE_API_URL` (e.g. point at a local server
 * during development).
 */
export const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://web-crm-green.vercel.app/api/v1'
