import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
} from '../services/authService'
import type { LoginInput } from '../types/auth'
import { getAccessToken, getUser, setUser } from '../lib/tokenStorage'
import type { AuthUser, SessionOrganization } from '../types/auth'

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => getUser())
  const [organizations, setOrganizations] = useState<SessionOrganization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!getAccessToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await getMe()
        if (!cancelled) {
          setUserState(me.user)
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
    setUserState(session.user)
    setUser(session.user)
    setOrganizations(session.organizations)
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUserState(null)
    setOrganizations([])
    window.location.assign('/login')
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await getMe()
    setUserState(me.user)
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
