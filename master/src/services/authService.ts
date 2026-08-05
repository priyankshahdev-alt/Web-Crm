import { http } from '../lib/api'
import {
  clearSession,
  getRefreshToken,
  setTokens,
  setUser,
} from '../lib/tokenStorage'
import type { AuthSession, LoginInput, MeResponse } from '../types/auth'

export async function login(input: LoginInput): Promise<AuthSession> {
  const session = await http.post<AuthSession>('/auth/login', input)
  setTokens(session.accessToken, session.refreshToken)
  setUser(session.user)
  return session
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await http.post<boolean>('/auth/logout', { refreshToken })
    }
  } finally {
    clearSession()
  }
}

export async function getMe(): Promise<MeResponse> {
  const me = await http.get<MeResponse>('/auth/me')
  setUser(me.user)
  return me
}
