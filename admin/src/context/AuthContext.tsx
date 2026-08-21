import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  exchangeImpersonate,
} from '../services/authService'
import type { LoginInput } from '../services/authService'
import { getAccessToken } from '../lib/tokenStorage'
import type { AuthUser, SessionOrganization } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  organizations: SessionOrganization[]
  loading: boolean
  isAuthenticated: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Pull a master-issued `?ticket=` off the URL and exchange it for a session.
 * Returns true when a ticket was consumed (the caller then stores the user).
 */
async function consumeImpersonateTicket(
  setUser: (user: AuthUser) => void,
  setOrganizations: (orgs: SessionOrganization[]) => void,
): Promise<boolean> {
  const params = new URLSearchParams(window.location.search)
  const ticket = params.get('ticket')
  if (!ticket) return false

  try {
    const session = await exchangeImpersonate(ticket)
    setUser(session.user)
    setOrganizations(session.organizations ?? [])
    const next = new URL(window.location.href)
    next.searchParams.delete('ticket')
    window.history.replaceState({}, '', next.toString())
    return true
  } catch {
    // Leave the ticket in place so an error screen can explain the failure.
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [organizations, setOrganizations] = useState<SessionOrganization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (await consumeImpersonateTicket(setUser, setOrganizations)) {
        if (!cancelled) setLoading(false)
        return
      }

      if (!getAccessToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await getMe()
        if (!cancelled) {
          setUser(me.user)
          setOrganizations(me.organizations)
        }
      } catch {
        // The axios interceptor clears tokens and redirects to /login.
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const session = await loginRequest(input)
    setUser(session.user)
    setOrganizations(session.organizations)
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
    setOrganizations([])
    window.location.assign('/login')
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await getMe()
    setUser(me.user)
    setOrganizations(me.organizations)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      organizations,
      loading,
      isAuthenticated: user !== null,
      login,
      logout,
      refreshUser,
    }),
    [user, organizations, loading, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
