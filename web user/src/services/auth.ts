import { http, isAxiosError } from './api'
import { signIn, signOut, getSession, type WebUserSession, type WebSiteOrg } from '../lib/session'

export interface LoginInput {
  email: string
  password: string
}

const delay = (ms = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  async login(input: LoginInput): Promise<WebUserSession> {
    try {
      // Login can take a while when the backend DB pooler is slow, so give it
      // a generous but bounded window instead of the shared 4.5s timeout.
      const { data } = await http.post('/auth/login', input, { timeout: 30_000 })
      const payload = data.data
      const membership =
        payload.organizations?.find((org: { isCurrent: boolean }) => org.isCurrent) ??
        payload.organizations?.[0]
      const session: WebUserSession = {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        currentOrgId: membership?.id ?? 'being-sevak',
        currentOrgSlug: membership?.slug,
        currentOrgName: membership?.name,
        organizations: (payload.organizations ?? []).map((org: WebSiteOrg & { isCurrent: boolean }) => ({
          id: org.id,
          slug: org.slug,
          name: org.name,
          logoUrl: org.logoUrl ?? null,
          website: org.website ?? null,
          role: org.role,
          roleName: org.roleName,
          isCurrent: org.isCurrent,
        })),
        user: {
          id: payload.user.id,
          email: payload.user.email,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
          role: payload.user.roles?.[0] ?? 'admin',
          roleName: membership?.roleName ?? 'Website Administrator',
        },
      }
      signIn(session)
      return session
    } catch (error) {
      if (isAxiosError(error)) {
        // Backend answered.
        if (error.response) {
          // A 4xx is a real credential rejection from the API.
          if (error.response.status < 500) {
            throw new Error('Invalid email or password')
          }
          // A 5xx means the backend is unreachable (the dev proxy also
          // returns 500 when the target isn't running).
          throw new Error('Cannot reach the server. Make sure the API server is running, then try again.')
        }
        // Request aborted (client timeout) — the backend answered too slowly.
        if (error.code === 'ECONNABORTED') {
          throw new Error('Login timed out. The backend is responding slowly — please try again.')
        }
        // No response at all — backend unreachable.
        throw new Error('Cannot reach the server. Make sure the API server is running, then try again.')
      }
      throw new Error('Login failed, please try again')
    }
  },

  async switchOrganization(organizationId: string): Promise<WebUserSession> {
    const session = getSession()
    if (!session) throw new Error('Not signed in')
    const { data } = await http.post('/auth/switch-organization', { organizationId })
    const payload = data.data as {
      accessToken: string
      organization: WebSiteOrg & { role?: string; roleName?: string }
    }
    const org = payload.organization
    const organizations = (session.organizations ?? []).map((item) => ({
      ...item,
      isCurrent: item.id === org.id,
    }))
    const updated: WebUserSession = {
      ...session,
      accessToken: payload.accessToken,
      currentOrgId: org.id,
      currentOrgSlug: org.slug,
      currentOrgName: org.name,
      organizations,
      user: {
        ...session.user,
        role: org.role ?? session.user.role,
        roleName: org.roleName ?? session.user.roleName,
      },
    }
    signIn(updated)
    return updated
  },

  async logout(): Promise<void> {
    try {
      await http.post('/auth/logout', {})
    } catch {
      /* offline */
    }
    signOut()
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await delay()
    if (newPassword.length < 8) throw new Error('Password must be at least 8 characters')
    if (currentPassword === newPassword) {
      throw new Error('New password must differ from current')
    }
  },
}
