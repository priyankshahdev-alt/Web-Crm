import { http, isAxiosError } from './api'
import { signIn, signOut, type WebUserSession } from '../lib/session'

export interface LoginInput {
  email: string
  password: string
}

const delay = (ms = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const DEMO_USER: WebUserSession = {
  accessToken: 'demo-token',
  refreshToken: 'demo-refresh',
  currentOrgId: 'being-sevak',
  currentOrgSlug: 'being-sevak',
  user: {
    id: 'u1',
    email: 'rahul@beingsevak.org',
    firstName: 'Rahul',
    lastName: 'Mehta',
    role: 'admin',
    roleName: 'Website Administrator',
    avatarUrl: null,
  },
}

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
        // Backend answered with real credentials — surface the error.
        if (error.response) {
          if (error.response.status >= 500) {
            throw new Error('Backend is unreachable, please try again')
          }
          throw new Error('Invalid email or password')
        }
        // Request aborted (client timeout) — the backend answered too slowly.
        if (error.code === 'ECONNABORTED') {
          throw new Error('Login timed out. The backend is responding slowly — please try again.')
        }
      }
      // Offline demo: accept the seeded demo account.
      await delay()
      if (
        input.email.toLowerCase() === 'rahul@beingsevak.org' &&
        input.password.length >= 8
      ) {
        signIn(DEMO_USER)
        return DEMO_USER
      }
      throw new Error('Invalid email or password')
    }
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
