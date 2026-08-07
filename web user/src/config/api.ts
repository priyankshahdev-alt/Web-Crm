/**
 * Base URL for the backend API.
 *
 * Relative (`/api/v1`) so development requests go through the Vite proxy
 * (see `vite.config.ts`) and production requests resolve on the same origin.
 */
export const BASE_URL = '/api/v1'

/**
 * Base origin of the public website preview served by this organization's
 * frontend in development. "View site" links in the panel open this origin.
 */
export const PUBLIC_SITE_ORIGIN = 'http://localhost:5177'

/**
 * When the backend is unreachable the app transparently falls back to the
 * local mock repository so the CMS remains fully explorable.
 */
export const API_TIMEOUT_MS = 4500
