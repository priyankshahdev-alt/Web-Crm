import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../config/api'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './tokenStorage'

/**
 * Shared Axios instance for all API calls.
 *
 * - Request interceptor attaches the current access token as a Bearer header.
 * - Response interceptor unwraps the server's `{ success, message, data }`
 *   envelope so call sites receive the `data` payload directly.
 * - On a 401 it attempts one silent refresh (`POST /auth/refresh`) and retries
 *   the original request; if refresh fails the session is cleared and the user
 *   is sent back to `/login`.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/** Bare client (no interceptors) used only for the refresh call itself. */
const bareClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

async function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  try {
    const response = await bareClient.post('/auth/refresh', { refreshToken })
    const body = response.data?.data
    if (body?.accessToken && body?.refreshToken) {
      setTokens(body.accessToken, body.refreshToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data.data,
  async (error) => {
    const response = error?.response
    const config = error?.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined

    const isLoginOrRefresh =
      typeof config?.url === 'string' &&
      (config.url.endsWith('/auth/login') || config.url.endsWith('/auth/refresh'))

    if (response?.status === 401 && config && !config._retry && !isLoginOrRefresh) {
      config._retry = true
      const refreshed = await refreshSession()
      if (refreshed) {
        const token = getAccessToken()
        if (token) {
          config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
        }
        return apiClient(config)
      }
      clearSession()
      redirectToLogin()
    }
    return Promise.reject(error)
  },
)

/**
 * Typed HTTP helpers. The response interceptor unwraps the server's
 * `{ data }` envelope, so these resolve with the payload type directly.
 */
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get(url, config) as unknown as Promise<T>,
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post(url, data, config) as unknown as Promise<T>,
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch(url, data, config) as unknown as Promise<T>,
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put(url, data, config) as unknown as Promise<T>,
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete(url, config) as unknown as Promise<T>,
}

/** Extract a human-friendly message from an unknown error. */
export function apiErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: unknown } } }).response
    const message = response?.data?.message
    if (typeof message === 'string' && message) return message
  }
  return err instanceof Error && err.message ? err.message : fallback
}
