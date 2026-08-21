import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { SiteAdmin, SiteDetail, SiteUser } from '../types/website'
import { websiteService } from '../services/websiteService'
import { apiErrorMessage } from '../lib/api'
import { Pill } from '../components/ui/Pill'
import {
  ChevronLeftIcon,
  GlobeIcon,
  UsersIcon,
  ShieldIcon,
} from '../components/icons'

const formatDate = (iso: string | null): string => {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold leading-none text-ink">{value}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.06em] text-faint">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

export function WebsiteDetailPage() {
  const { id = '' } = useParams()
  const [detail, setDetail] = useState<SiteDetail | null>(null)
  const [users, setUsers] = useState<SiteUser[]>([])
  const [admins, setAdmins] = useState<SiteAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [detailResult, userResult, adminResult] = await Promise.all([
        websiteService.detail(id),
        websiteService.users(id),
        websiteService.admins(id),
      ])
      setDetail(detailResult)
      setUsers(userResult)
      setAdmins(adminResult)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load this website.'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-soft" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-soft" />
          ))}
        </div>
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-soft" />
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center shadow-card">
          <p className="text-base font-semibold text-ink">Could not load website</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const site = detail.organization

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to dashboard
      </Link>

      <header className="mt-4 mb-10 flex flex-wrap items-start justify-between gap-4 animate-rise">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-white shadow-md shadow-brand/20">
            <GlobeIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-gray-900">
              {site.name}
            </h1>
            <p className="mt-1.5 text-sm text-muted">{site.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill variant={site.status === 'ACTIVE' ? 'success' : 'warning'} dot>
            {site.status.toLowerCase()}
          </Pill>
          <Pill variant="neutral">{site.plan}</Pill>
        </div>
      </header>

      <section aria-label="Website stats" className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-rise">
        <StatCard label="Users" value={detail.counts.users} icon={<UsersIcon className="h-5 w-5" />} />
        <StatCard label="Projects" value={detail.counts.projects} icon={<ShieldIcon className="h-5 w-5" />} />
        <StatCard label="Pages" value={detail.counts.pages} icon={<GlobeIcon className="h-5 w-5" />} />
        <StatCard label="Donations" value={detail.counts.donations} icon={<ShieldIcon className="h-5 w-5" />} />
      </section>

      <section className="mb-10 animate-rise">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Users</h2>
          <Pill variant="brand">{users.length}</Pill>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          {users.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <UsersIcon className="mx-auto mb-3 h-8 w-8 text-faint" />
              <p className="text-sm font-semibold text-ink">No users on this website</p>
              <p className="mt-1 text-xs text-muted">
                Website users are created from the admin panel.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      User
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Role
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Status
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Last login
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft">
                  {users.map((user) => (
                    <tr key={user.id} className="transition-colors duration-150 hover:bg-row-hover">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium text-ink">{user.email}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Pill variant="neutral">{user.roleName ?? 'Member'}</Pill>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Pill variant={user.isActive ? 'success' : 'neutral'} dot>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Pill>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">
                        {formatDate(user.joinedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="animate-rise">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Managing admins</h2>
          <Pill variant="brand">{admins.length}</Pill>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          {admins.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <ShieldIcon className="mx-auto mb-3 h-8 w-8 text-faint" />
              <p className="text-sm font-semibold text-ink">No admin assigned</p>
              <p className="mt-1 text-xs text-muted">
                Assign this website to an admin from the Admin page.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Admin
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Status
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      Assigned
                    </th>
                    <th scope="col" className="border-b-2 border-line px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="transition-colors duration-150 hover:bg-row-hover">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                            {admin.email.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium text-ink">{admin.email}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Pill variant={admin.isActive ? 'success' : 'neutral'} dot>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </Pill>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          to="/admin"
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-brand transition-colors duration-150 hover:bg-brand-soft"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
