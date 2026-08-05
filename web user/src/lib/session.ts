const STORAGE_SESSION_KEY = 'webcms.session'

export interface WebUserSession {
  accessToken: string
  refreshToken: string
  currentOrgId?: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    roleName: string
    avatarUrl?: string | null
  }
}

export function getSession(): WebUserSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_SESSION_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as WebUserSession
    if (!parsed.accessToken || !parsed.user?.email) return null
    return parsed
  } catch {
    return null
  }
}

export function signIn(session: WebUserSession): WebUserSession {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session))
  return session
}

export function signOut(): void {
  localStorage.removeItem(STORAGE_SESSION_KEY)
}
