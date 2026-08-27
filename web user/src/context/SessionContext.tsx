import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSession, signOut as clearSession, type WebUserSession } from '../lib/session'
import { authService } from '../services/auth'
import { backendAvailable } from '../services/api'

interface SessionContextValue {
  session: WebUserSession | null
  ready: boolean
  liveMode: boolean
  signIn: (session: WebUserSession) => void
  signOut: () => void
  switchWebsite: (organizationId: string) => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<WebUserSession | null>(() => getSession())
  const [ready, setReady] = useState(false)
  const [liveMode, setLiveMode] = useState(false)

  useEffect(() => {
    void backendAvailable().then((live) => {
      setLiveMode(live)
      setReady(true)
    })
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      ready,
      liveMode,
      signIn: (next) => {
        setSession(next)
      },
      signOut: () => {
        void authService.logout()
        clearSession()
        setSession(null)
      },
      switchWebsite: async (organizationId) => {
        const next = await authService.switchOrganization(organizationId)
        setSession(next)
      },
    }),
    [session, ready, liveMode],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within SessionProvider')
  return context
}
