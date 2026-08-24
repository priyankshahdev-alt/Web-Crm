import { http } from '../lib/axios'
import { clearTokens, getRefreshToken, setTokens } from '../lib/tokenStorage'
import type { AuthSession, MeResponse } from '../types'

export interface LoginInput {
  email: string
  password: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const session = await http.post<AuthSession>('/auth/login', input)
  setTokens(session.accessToken, session.refreshToken)
  return session
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await http.post<boolean>('/auth/logout', { refreshToken })
    }
  } finally {
    clearTokens()
  }
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<void> {
  await http.post<boolean>('/auth/change-password', input)
}

export async function getMe(): Promise<MeResponse> {
  return http.get<MeResponse>('/auth/me')
}

/** Exchange a master-issued "log in as admin" ticket for a session. */
export async function exchangeImpersonate(ticket: string): Promise<AuthSession> {
  const session = await http.post<AuthSession>('/auth/impersonate/exchange', {
    ticket,
  })
  setTokens(session.accessToken, session.refreshToken)
  return session
}
