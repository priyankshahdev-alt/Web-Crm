import { http, isAxiosError } from './api'
import { signIn, signOut, type WebUserSession } from '../lib/session'

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
        currentOrgId: membership?.id ?? payload.organizations?.[0]?.id,
        currentOrgSlug: membership?.slug ?? payload.organizations?.[0]?.slug,
        currentOrgName: membership?.name ?? payload.organizations?.[0]?.name,
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
          // A 5xx here means the backend is unreachable (the dev proxy also
          // returns 500 when the target isn't running), so fall through to the
          // offline demo below instead of blocking the user.
          if (error.response.status < 500) {
            throw new Error('Invalid email or password')
          }
        } else if (error.code === 'ECONNABORTED') {
          // Request aborted (client timeout) — the backend answered too slowly.
          throw new Error('Login timed out. The backend is responding slowly — please try again.')
        }
        // No response — backend unreachable — fall through to the offline demo.
      }
      // Offline demo: accept the seeded demo account.
      await delay()
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
