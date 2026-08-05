import axios, { AxiosError } from 'axios'
import { API_TIMEOUT_MS, BASE_URL } from '../config/api'
import { getSession } from '../lib/session'

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const session = getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  if (session?.currentOrgId) {
    config.headers['X-Organization-Id'] = session.currentOrgId
  }
  return config
})

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError
}

let liveProbe: boolean | null = null

/**
 * Probe whether the backend is reachable. The result is cached for the page
 * session so every subsequent read takes the fast path.
 */
export async function backendAvailable(): Promise<boolean> {
  if (liveProbe !== null) return liveProbe
  try {
    await http.get('/health', { timeout: 2500 })
    liveProbe = true
  } catch {
    liveProbe = false
  }
  return liveProbe
}

export function isLiveMode(): boolean {
  return liveProbe === true
}
