const STORAGE_SESSION_KEY = 'master-crm.session'

export interface MasterSession {
  accessToken: string
  refreshToken: string
  username: string
  email: string
  firstName: string
  lastName: string
  isMaster: boolean
}

export function getCurrentMaster(): MasterSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_SESSION_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as MasterSession
    if (!parsed.accessToken || !parsed.username) return null
    return parsed
  } catch {
    return null
  }
}

export function signIn(session: MasterSession): MasterSession {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session))
  return session
}

export function signOut(): void {
  localStorage.removeItem(STORAGE_SESSION_KEY)
}
