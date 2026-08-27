/**
 * Base URL for the backend API.
 *
 * Relative (`/api/v1`) so development requests go through the Vite proxy
 * (see `vite.config.ts`) and avoid CORS. Production uses VITE_API_URL.
 */
export const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

/**
 * Base origin of the public website. "View site" / preview links in the CMS
 * now open the actual production site, not a localhost preview.
 */
export const PUBLIC_SITE_ORIGIN = 'https://beingsevak.org'

export const API_TIMEOUT_MS = 10000
