import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentMaster, signOut } from '../lib/session'
import { useDropdown } from '../hooks/useDropdown'
import {
  ChevronDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from './icons'

const menuItemClass =
  'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const location = useLocation()
  const { open, toggle, close, rootRef } = useDropdown()

  const session = getCurrentMaster()
  const username = session?.username ?? 'master'
  const displayName = username.charAt(0).toUpperCase() + username.slice(1)

  const handleNavigate = (path: string) => {
    close()
    navigate(path)
  }

  const handleLogout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full p-1.5 transition hover:bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight text-ink">
            {displayName}
          </span>
          <span className="block text-xs leading-tight text-muted">
            Super admin
          </span>
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-muted transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-soft bg-white p-2 shadow-pop"
        >
          <div className="flex items-center gap-3 border-b border-soft p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <UserIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted">@{username}</p>
            </div>
          </div>

          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              aria-current={location.pathname === '/profile' ? 'page' : undefined}
              onClick={() => handleNavigate('/profile')}
              className={`${menuItemClass} ${
                location.pathname === '/profile'
                  ? 'bg-brand-soft text-brand'
                  : 'text-ink hover:bg-soft'
              }`}
            >
              <UserIcon className="h-4 w-4 text-muted" />
              My Profile
            </button>
            <button
              type="button"
              role="menuitem"
              aria-current={
                location.pathname === '/settings' ? 'page' : undefined
              }
              onClick={() => handleNavigate('/settings')}
              className={`${menuItemClass} ${
                location.pathname === '/settings'
                  ? 'bg-brand-soft text-brand'
                  : 'text-ink hover:bg-soft'
              }`}
            >
              <SettingsIcon className="h-4 w-4 text-muted" />
              Settings
            </button>
          </div>

          <div className="my-1 border-t border-soft" />

          <button
            type="button"
            onClick={handleLogout}
            className={`${menuItemClass} text-danger hover:bg-danger/10`}
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
