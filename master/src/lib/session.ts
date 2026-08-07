import { clearSession, getAccessToken, getRefreshToken, getUser } from './tokenStorage'

export interface MasterSession {
  accessToken: string
  refreshToken: string
  username: string
  email: string
  isMaster: boolean
}

/** Current session (read from stored user), or null when signed out. */
export function getCurrentMaster(): MasterSession | null {
  const user = getUser()
  if (!user) return null
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return null
  return {
    accessToken,
    refreshToken,
    username: user.email,
    email: user.email,
    isMaster: user.isMaster,
  }
}

/** No-op retained for compatibility; sessions are created through auth login. */
export function signIn(): MasterSession {
  const session = getCurrentMaster()
  if (session) return session
  throw new Error('No session')
}

export function signOut(): void {
  clearSession()
}
