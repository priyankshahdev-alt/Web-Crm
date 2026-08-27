import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { API_TIMEOUT_MS, BASE_URL } from '../config/api'
import { getSession, signIn, signOut } from '../lib/session'

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

/** Bare client (no interceptors) used only for the refresh call itself. */
const bareHttp = axios.create({
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

/**
 * Handle 401 (refresh), and transient 502/503/429 (proxy / rate-limit) with one retry.
 * Keeps the UI from spamming toasts when the dev backend restarts.
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error?.response
    const config = error?.config as (AxiosRequestConfig & { _retry?: boolean; _retryTransient?: boolean }) | undefined

    const isLoginOrRefresh =
      typeof config?.url === 'string' &&
      (config.url.endsWith('/auth/login') || config.url.endsWith('/auth/refresh'))

    if (response?.status === 401 && config && !config._retry && !isLoginOrRefresh) {
      config._retry = true
      const session = getSession()
      if (session?.refreshToken) {
        try {
          const { data } = await bareHttp.post('/auth/refresh', {
            refreshToken: session.refreshToken,
          })
          const payload = data.data
          if (payload?.accessToken && payload?.refreshToken) {
            signIn({
              ...session,
              accessToken: payload.accessToken,
              refreshToken: payload.refreshToken,
            })
            config.headers = { ...config.headers, Authorization: `Bearer ${payload.accessToken}` }
            return http(config)
          }
        } catch {
          /* refresh failed — fall through to signing out */
        }
      }
      signOut()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    // One automatic retry for transient gateway / rate-limit errors during dev
    const transient = response?.status === 502 || response?.status === 503 || response?.status === 429
    if (transient && config && !config._retryTransient && !isLoginOrRefresh) {
      config._retryTransient = true
      const delayMs = response.status === 429 ? 800 : 400
      await new Promise((r) => setTimeout(r, delayMs))
      return http(config)
    }

    return Promise.reject(error)
  },
)

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError
}

let liveProbe: boolean | null = null
let liveProbePromise: Promise<boolean> | null = null

/**
 * Probe whether the backend is reachable. Cached per page session.
 * Used for Live API connection status indicator — does NOT automatically
 * switch to mock data (per spec: keep last successful real data).
 */
export function backendAvailable(): Promise<boolean> {
  if (!liveProbePromise) {
    liveProbePromise = new Promise<boolean>((resolve) => {
      http
        .get('/health', { timeout: 2500 })
        .then(() => {
          liveProbe = true
          resolve(true)
        })
        .catch(() => {
          liveProbe = false
          resolve(false)
        })
    })
  }
  return liveProbePromise
}

// Kick off probe early so Live/Offline badge is resolved before first data load.
backendAvailable()

export function isLiveMode(): boolean {
  return liveProbe === true
}

export function resetLiveProbe(): void {
  liveProbe = null
  liveProbePromise = null
}
