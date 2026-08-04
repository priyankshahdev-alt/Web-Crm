import type { AuthUser } from '../types/auth'

const ACCESS_KEY = 'master-crm:access-token'
const REFRESH_KEY = 'master-crm:refresh-token'
const USER_KEY = 'master-crm:user'

/**
 * Persists the JWT pair and the current user to localStorage so the session
 * survives reloads. The refresh token is rotated by the server on refresh.
 */
export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return window.localStorage.getItem(REFRESH_KEY)
}

export function setAccessToken(accessToken: string): void {
  window.localStorage.setItem(ACCESS_KEY, accessToken)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  window.localStorage.setItem(ACCESS_KEY, accessToken)
  window.localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function getUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setUser(user: AuthUser): void {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
}

export function clearSession(): void {
  clearTokens()
  window.localStorage.removeItem(USER_KEY)
}
