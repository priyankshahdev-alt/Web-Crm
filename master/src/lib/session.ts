const STORAGE_OWNER_KEY = 'master-crm.current-master'
const CURRENT_MASTER = 'master'

export interface MasterSession {
  username: string
}

export function getCurrentMaster(): MasterSession | null {
  const stored = localStorage.getItem(STORAGE_OWNER_KEY)
  if (!stored) return null
  return { username: stored }
}

export function signIn(): MasterSession {
  localStorage.setItem(STORAGE_OWNER_KEY, CURRENT_MASTER)
  return { username: CURRENT_MASTER }
}

export function signOut(): void {
  localStorage.removeItem(STORAGE_OWNER_KEY)
}
