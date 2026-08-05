import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSession } from '../../context/SessionContext'
import { NotificationDropdown } from '../NotificationDropdown'
import { ProfileDropdown } from '../ProfileDropdown'
import { SidebarNav, SidebarFooter } from './Sidebar'
import { DashboardIcon, MenuIcon, SearchIcon, XIcon, ExternalLinkIcon } from '../icons'
import { CURRENT_WEBSITE } from '../../data/seed'

function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{CURRENT_WEBSITE.name}</p>
            <p className="hidden text-xs text-muted sm:block">
              Website CMS · {CURRENT_WEBSITE.url}
            </p>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <a
            href={`https://${CURRENT_WEBSITE.url}`}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-xs font-semibold text-muted transition hover:bg-soft hover:text-ink md:inline-flex"
          >
            <ExternalLinkIcon className="h-3.5 w-3.5" />
            View site
          </a>
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
