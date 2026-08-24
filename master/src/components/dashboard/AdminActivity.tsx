import { useCallback, useEffect, useRef, useState } from 'react'
import type { AuditLogEntry } from '../../types/audit'
import { auditService } from '../../services/auditService'
import { Pill } from '../ui/Pill'
import { Button } from '../ui/Button'
import { RefreshIcon } from '../icons'

const POLL_INTERVAL_MS = 15_000
const MAX_ROWS = 10

const MODULE_LABELS: Record<string, string> = {
  user: 'Admins',
  organization: 'Website',
  role: 'Roles & Permissions',
  page: 'Pages',
  section: 'Content',
  'section-template': 'Content Templates',
  media: 'Media',
  menu: 'Menus',
  banner: 'Banners',
  slider: 'Sliders',
  settings: 'Settings',
  website: 'Website',
  project: 'Projects',
  team: 'Team',
  event: 'Events',
  blog: 'Blog',
  'blog-category': 'Blog Categories',
  gallery: 'Gallery',
  document: 'Documents',
  'document-category': 'Document Categories',
  testimonial: 'Testimonials',
  partner: 'Partners',
  faq: 'FAQs',
  campaign: 'Campaigns',
  donor: 'Donors',
  volunteer: 'Volunteers',
  beneficiary: 'Beneficiaries',
  employee: 'Employees',
  department: 'Departments',
  account: 'Accounts',
  transaction: 'Transactions',
  award: 'Awards',
  location: 'Locations',
  import: 'Content Import',
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'created',
  UPDATE: 'updated',
  DELETE: 'deleted',
  ASSIGN_ORG: 'assigned to a website',
  REMOVE_ORG: 'removed from a website',
  ASSIGN_ADMIN: 'assigned an admin',
  UNASSIGN_ADMIN: 'removed an admin',
  PUBLISH: 'published',
  UNPUBLISH: 'unpublished',
  IMPORT: 'imported',
}

interface StatusMeta {
  label: string
  variant: 'success' | 'info' | 'danger' | 'warning' | 'brand'
}

const STATUS_META: Record<string, StatusMeta> = {
  CREATE: { label: 'Created', variant: 'success' },
  UPDATE: { label: 'Updated', variant: 'info' },
  DELETE: { label: 'Deleted', variant: 'danger' },
  ASSIGN_ORG: { label: 'Assigned', variant: 'brand' },
  REMOVE_ORG: { label: 'Removed', variant: 'danger' },
  ASSIGN_ADMIN: { label: 'Assigned', variant: 'brand' },
  UNASSIGN_ADMIN: { label: 'Removed', variant: 'danger' },
  PUBLISH: { label: 'Published', variant: 'success' },
  UNPUBLISH: { label: 'Unpublished', variant: 'warning' },
  IMPORT: { label: 'Imported', variant: 'info' },
}

const formatDateTime = (iso: string): string => {
  const date = new Date(iso)
  const formatted = date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  return formatted.replace(', ', ' · ')
}

function adminLabel(entry: AuditLogEntry): string {
  const user = entry.user
  if (!user) return 'System'
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return name || user.email
}

function adminInitial(entry: AuditLogEntry): string {
  const label = adminLabel(entry)
  return label.charAt(0).toUpperCase()
}

export function AdminActivity() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const items = await auditService.recent()
      setEntries(items)
      setError(null)
    } catch {
      setError('Could not load recent activity.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void load()
    timerRef.current = setInterval(() => void load(true), POLL_INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [load])

  const handleRefresh = () => {
    setRefreshing(true)
    void load(true)
  }

  const visibleEntries = entries.slice(0, MAX_ROWS)

  return (
    <section
      aria-labelledby="activity-title"
      className="mt-8 animate-dash-rise sm:mt-10"
      style={{ animationDelay: '120ms' }}
    >
      <div className="mb-8 flex animate-dash-rise flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
            Activity
          </p>
          <h2
            id="activity-title"
            className="mt-1.5 text-xl font-semibold text-ink"
          >
            Admin Activity
          </h2>
          <p className="mt-1 text-sm text-muted">
            Live changes by admins across websites and CMS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Pill variant="success" dot pulse>
            Live
          </Pill>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefresh}
            loading={refreshing}
          >
            <RefreshIcon className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center shadow-card">
          <p className="text-sm font-medium text-ink">{error}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-2 text-sm font-semibold text-brand hover:underline"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-2xl bg-soft" />
          ))}
        </div>
      ) : visibleEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center shadow-card">
          <p className="text-sm font-medium text-ink">No activity yet</p>
          <p className="mt-1 text-sm text-muted">
            Changes made by admins will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-[24%] border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                  >
                    Admin
                  </th>
                  <th
                    scope="col"
                    className="w-[19%] border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                  >
                    Action
                  </th>
                  <th
                    scope="col"
                    className="w-[15%] border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                  >
                    Module
                  </th>
                  <th
                    scope="col"
                    className="w-[15%] border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="w-[18%] border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                  >
                    Date / Time
                  </th>
                  <th
                    scope="col"
                    className="w-[9%] border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft">
                {visibleEntries.map((entry) => {
                  const status = STATUS_META[entry.action] ?? {
                    label: 'Success',
                    variant: 'success',
                  } as StatusMeta
                  const actionLabel = ACTION_LABELS[entry.action] ?? entry.action.toLowerCase()
                  return (
                    <tr
                      key={entry.id}
                      className="transition-colors duration-150 hover:bg-row-hover"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                            {adminInitial(entry)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-ink">
                              {adminLabel(entry)}
                            </p>
                            {entry.user?.email ? (
                              <p className="whitespace-normal break-words text-xs text-muted">
                                {entry.user.email}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 capitalize text-muted">
                        {actionLabel}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Pill variant="neutral">
                          {MODULE_LABELS[entry.resource] ?? entry.resource}
                        </Pill>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">
                        {entry.organization?.name ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">
                        {formatDateTime(entry.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Pill variant={status.variant} dot>
                          {status.label}
                        </Pill>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
