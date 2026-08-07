const STORAGE_SESSION_KEY = 'webcms.session'

export interface WebSiteOrg {
  id: string
  slug: string
  name: string
  logoUrl?: string | null
  website?: string | null
  role?: string
  roleName?: string
  isCurrent?: boolean
}

export interface WebUserSession {
  accessToken: string
  refreshToken: string
  currentOrgId?: string
  currentOrgSlug?: string
  currentOrgName?: string
  organizations?: WebSiteOrg[]
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

export function currentOrganization(session: WebUserSession | null): WebSiteOrg | null {
  if (!session) return null
  const found = session.organizations?.find((org) => org.id === session.currentOrgId)
  if (found) return found
  return session.currentOrgId
    ? { id: session.currentOrgId, slug: session.currentOrgSlug ?? '', name: session.currentOrgName ?? '' }
    : null
}

/**
 * Display-only labels for the website switcher/header. Website identity itself
 * stays slug-based (org.slug); this only curates the friendly name shown in the
 * UI (e.g. the DB name is "Being Sevak Foundation" but the site brand is
 * "Being Sevak"). Unknown websites fall back to their stored name.
 */
const SITE_DISPLAY_NAMES: Record<string, string> = {
  'being-sevak': 'Being Sevak',
  mann: 'Mann Care Foundation',
  ashray: 'Ashray',
}

export function siteDisplayName(slug: string | undefined, fallback: string): string {
  if (!slug) return fallback
  return SITE_DISPLAY_NAMES[slug] ?? fallback
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
