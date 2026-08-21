import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdminUser } from '../../types/admin'
import type { ManagedWebsite, SiteUser } from '../../types/website'
import { websiteService } from '../../services/websiteService'
import { impersonate } from '../../services/authService'
import { ADMIN_PANEL_URL } from '../../config/api'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'
import {
  ChevronRightIcon,
  LogInIcon,
  UsersIcon,
} from '../icons'

interface AdminDetailPanelProps {
  admin: AdminUser
  websites: ManagedWebsite[]
  onClose: () => void
}

interface ManagedSiteState {
  site: ManagedWebsite
  users: SiteUser[]
  loading: boolean
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function AdminDetailPanel({
  admin,
  websites,
  onClose,
}: AdminDetailPanelProps) {
  const toast = useToast()
  const [impersonating, setImpersonating] = useState(false)
  const [sites, setSites] = useState<ManagedSiteState[]>([])
  const [loadingSites, setLoadingSites] = useState(true)

  const managed = websites.filter((website) =>
    (admin.managedWebsites ?? []).includes(website.id),
  )

  const loadUsers = useCallback(async () => {
    setLoadingSites(true)
    const states: ManagedSiteState[] = await Promise.all(
      managed.map(async (site) => {
        try {
          const users = await websiteService.users(site.id)
          return { site, users, loading: false }
        } catch {
          return { site, users: [], loading: false }
        }
      }),
    )
    setSites(states)
    setLoadingSites(false)
  }, [managed])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  const handleLoginAs = async () => {
    setImpersonating(true)
    try {
      const { ticket } = await impersonate(admin.id)
      const url = new URL(ADMIN_PANEL_URL)
      url.searchParams.set('ticket', ticket)
      window.open(url.toString(), '_blank', 'noopener')
      toast.success({
        title: 'Login link created',
        description: `Opening the admin panel as ${admin.email}.`,
      })
    } catch {
      toast.error({
        title: 'Could not start a session',
        description: 'Only active site admins can be impersonated.',
      })
    } finally {
      setImpersonating(false)
    }
  }

  return (
    <div className="border-t border-line bg-slate-50/60 px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">
            {admin.email}
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            Websites this admin manages and the users on them.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {admin.role !== 'master' ? (
            <Button
              size="sm"
              variant="secondary"
              loading={impersonating}
              onClick={() => void handleLoginAs()}
            >
              <LogInIcon className="h-4 w-4" />
              Log in as admin
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {loadingSites ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-soft" />
          <div className="h-24 animate-pulse rounded-2xl bg-soft" />
        </div>
      ) : managed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="text-sm font-semibold text-ink">No websites assigned</p>
          <p className="mt-1 text-xs text-muted">
            Assign websites to this admin from the edit modal.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sites.map(({ site, users, loading }) => (
            <div
              key={site.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <UsersIcon className="h-4 w-4" />
                  </span>
                  <Link
                    to={`/websites/${site.id}`}
                    className="text-sm font-semibold text-ink transition-colors hover:text-brand"
                  >
                    {site.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Pill variant="neutral">{users.length} users</Pill>
                  <Link
                    to={`/websites/${site.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                  >
                    Details
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="h-12 animate-pulse rounded-xl bg-soft" />
              ) : users.length === 0 ? (
                <p className="py-4 text-center text-xs text-faint">
                  No users on this website yet.
                </p>
              ) : (
                <ul className="divide-y divide-soft">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate text-sm font-medium text-ink">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill variant="neutral">
                          {user.roleName ?? 'Member'}
                        </Pill>
                        <Pill
                          variant={user.isActive ? 'success' : 'neutral'}
                          dot
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Pill>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[11px] text-faint">
        Last login {formatDate(admin.lastLoginAt)} · Created{' '}
        {formatDate(admin.createdAt)}
      </p>
    </div>
  )
}
