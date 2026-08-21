import { useState } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { AdminPage } from './pages/AdminPage'
import { RolePage } from './pages/RolePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { WebsiteDetailPage } from './pages/WebsiteDetailPage'
import { SidebarAdminSection } from './components/sidebar/AdminSection'
import { SidebarRoleSection } from './components/sidebar/RoleSection'
import { ProfileDropdown } from './components/ProfileDropdown'
import { NotificationDropdown } from './components/NotificationDropdown'
import { getCurrentMaster } from './lib/session'
import { DashboardIcon, MenuIcon, SearchIcon, XIcon } from './components/icons'

function RequireSession() {
  return getCurrentMaster() ? <Outlet /> : <Navigate to="/login" replace />
}

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-150 ${
    isActive
      ? 'bg-brand-soft text-brand'
      : 'text-muted hover:bg-soft hover:text-ink'
  }`

const mobileLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 ${
    isActive
      ? 'bg-brand-soft text-brand'
      : 'text-muted hover:bg-soft hover:text-ink'
  }`

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:gap-8 lg:px-10">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:hidden"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-brand/30">
              <DashboardIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">Master</p>
              <p className="hidden text-xs text-muted sm:block">
                Super admin console
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <SidebarAdminSection />
            <SidebarRoleSection />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="relative hidden md:block">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-64 rounded-full border border-line bg-slate-50 pl-10 pr-4 text-sm text-ink placeholder:text-faint transition-colors duration-150 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
            <div
              className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6"
            >
              <nav
                className="flex flex-col gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <NavLink to="/" end className={mobileLinkClass}>
                  Dashboard
                </NavLink>
                <SidebarAdminSection mobile />
                <SidebarRoleSection mobile />
              </nav>
              <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-slate-50 px-3.5">
                <SearchIcon className="h-4 w-4 shrink-0 text-faint" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-10 w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireSession />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/websites/:id" element={<WebsiteDetailPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
