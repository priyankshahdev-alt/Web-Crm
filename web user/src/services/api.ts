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
 * On a 401 the access token is invalid or stale (e.g. a leftover offline demo
 * token once the live backend is up). Attempt one silent refresh and retry the
 * original request; if refresh fails, clear the session and go back to login.
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error?.response
    const config = error?.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined

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
    return Promise.reject(error)
  },
)

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
