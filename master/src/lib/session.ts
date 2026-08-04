import { clearSession, getUser } from './tokenStorage'

export interface MasterSession {
  username: string
  email: string
  isMaster: boolean
}

/** Current session (read from stored user), or null when signed out. */
export function getCurrentMaster(): MasterSession | null {
  const user = getUser()
  if (!user) return null
  return {
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
