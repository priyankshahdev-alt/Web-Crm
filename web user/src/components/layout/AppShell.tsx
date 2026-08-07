import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSession } from '../../context/SessionContext'
import { useToast } from '../../context/ToastContext'
import { NotificationDropdown } from '../NotificationDropdown'
import { ProfileDropdown } from '../ProfileDropdown'
import { SidebarNav, SidebarFooter } from './Sidebar'
import {
  DashboardIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
  ExternalLinkIcon,
  GlobeIcon,
  CheckIcon,
  ChevronDownIcon,
} from '../icons'
import { CURRENT_WEBSITE } from '../../data/seed'
import { currentOrganization, siteDisplayName, type WebUserSession } from '../../lib/session'

/**
 * Public URL for the site the user is currently scoped to. Falls back to the
 * well-known Being Sevak URL so existing behaviour is unchanged; sites without
 * a known public domain resolve to `null` (no "View site" link shown).
 */
function resolveSiteUrl(session: WebUserSession | null): string | null {
  const org = currentOrganization(session)
  if (!org) return null
  if (org.website) return org.website.startsWith('http') ? org.website : `https://${org.website}`
  if (org.slug === 'being-sevak') return 'https://beingsevak.org'
  return null
}

function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [siteMenuOpen, setSiteMenuOpen] = useState(false)
  const [switchingId, setSwitchingId] = useState<string | null>(null)
  const siteMenuRef = useRef<HTMLDivElement>(null)
  const { session, switchWebsite } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (!siteMenuOpen) return
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (siteMenuRef.current && !siteMenuRef.current.contains(event.target as Node)) {
        setSiteMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [siteMenuOpen])

  const orgs = session?.organizations?.length ? session.organizations : []
  const current = currentOrganization(session) ?? {
    id: 'being-sevak',
    slug: 'being-sevak',
    name: CURRENT_WEBSITE.name,
  }
  const siteName = siteDisplayName(current.slug, current.name || CURRENT_WEBSITE.name)
  const siteUrl = resolveSiteUrl(session)

  const handleSwitch = async (orgId: string) => {
    if (orgId === session?.currentOrgId) {
      setSiteMenuOpen(false)
      return
    }
    setSwitchingId(orgId)
    try {
      await switchWebsite(orgId)
      setSiteMenuOpen(false)
      window.location.assign('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not switch website'
      toast(message, { variant: 'error' })
      setSwitchingId(null)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 xl:hidden"
        >
          {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-brand/30">
            <DashboardIcon className="h-6 w-6" />
          </span>
          <div className="relative min-w-0" ref={siteMenuRef}>
            {orgs.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-expanded={siteMenuOpen}
                  onClick={() => setSiteMenuOpen((open) => !open)}
                  className="flex max-w-full items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 transition hover:bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <GlobeIcon className="h-4 w-4 shrink-0 text-brand" />
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-sm font-bold text-ink">{siteName}</span>
                    <span className="block text-[11px] font-medium text-muted">Website CMS</span>
                  </span>
                  {switchingId ? (
                    <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-brand/40 border-t-brand" />
                  ) : (
                    <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-muted" />
                  )}
                </button>
                {siteMenuOpen ? (
                  <div className="animate-fade-in absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-slate-900/10">
                    <p className="border-b border-line px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-faint">
                      Switch website
                    </p>
                    <ul className="p-1.5">
                      {orgs.map((org) => {
                        const isCurrent = org.id === session?.currentOrgId
                        return (
                          <li key={org.id}>
                            <button
                              type="button"
                              disabled={switchingId !== null}
                              onClick={() => void handleSwitch(org.id)}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-soft disabled:opacity-60"
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                  isCurrent ? 'bg-brand text-white' : 'bg-brand-soft text-brand'
                                }`}
                              >
                                <GlobeIcon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-ink">
                                  {siteDisplayName(org.slug, org.name)}
                                </span>
                                <span className="block truncate text-[11px] text-muted">{org.slug}</span>
                              </span>
                              {isCurrent ? <CheckIcon className="h-4 w-4 shrink-0 text-brand" /> : null}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{siteName}</p>
                <p className="hidden text-xs text-muted sm:block">Website CMS</p>
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          {siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-xs font-semibold text-muted transition hover:bg-soft hover:text-ink md:inline-flex"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              View site
            </a>
          ) : null}
          <div className="relative hidden md:block">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="text"
              placeholder="Search CMS..."
              className="h-10 w-56 rounded-full border border-line bg-slate-50 pl-10 pr-4 text-sm text-ink placeholder:text-faint transition-colors duration-150 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="mobile-menu" className="animate-fade-in border-t border-line bg-white xl:hidden">
          <div className="mx-auto w-full px-4 py-4 sm:px-6">
            <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
            <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-slate-50 px-3.5">
              <SearchIcon className="h-4 w-4 shrink-0 text-faint" />
              <input
                type="text"
                placeholder="Search CMS..."
                className="h-10 w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export function AppShell() {
  const { session } = useSession()

  if (!session) return <Outlet />

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
      <AppHeader />
      <div className="flex flex-1">
        <aside className="sticky top-[72px] hidden h-[calc(100dvh-72px)] w-64 shrink-0 flex-col border-r border-line bg-white px-3 py-5 xl:flex">
          <div className="mb-2 flex-1 overflow-y-auto pr-1">
            <SidebarNav />
          </div>
          <SidebarFooter />
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Kept for the top-level desktop nav fallback (mirrors master header styling).
export const desktopNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-150 ${
    isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-soft hover:text-ink'
  }`

export function DesktopNavLink({ to, children, end }: { to: string; children: React.ReactNode; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className={desktopNavLinkClass}>
      {children}
    </NavLink>
  )
}
