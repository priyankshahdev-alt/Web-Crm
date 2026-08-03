import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminService } from '../../services/adminService'

const ADMINS_UPDATED_EVENT = 'admins:updated'

export function SidebarAdminSection({ mobile = false }: { mobile?: boolean }) {
  const location = useLocation()
  const [count, setCount] = useState(0)

  const loadCount = useCallback(async () => {
    try {
      const result = await adminService.list()
      setCount(result.length)
    } catch {
      setCount(0)
    }
  }, [])

  useEffect(() => {
    void loadCount()
    window.addEventListener(ADMINS_UPDATED_EVENT, loadCount)
    return () => window.removeEventListener(ADMINS_UPDATED_EVENT, loadCount)
  }, [loadCount])

  const active = location.pathname === '/admin'

  return (
    <Link
      to="/admin"
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-150 ${
        mobile
          ? 'rounded-xl px-3.5 py-2.5'
          : 'rounded-full px-3.5 py-1.5'
      } ${
        active
          ? 'bg-brand-soft text-brand'
          : 'text-muted hover:bg-soft hover:text-ink'
      }`}
    >
      Admin
      <span
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${
          active ? 'bg-white text-brand' : 'bg-soft text-ink'
        }`}
      >
        {count}
      </span>
    </Link>
  )
}
