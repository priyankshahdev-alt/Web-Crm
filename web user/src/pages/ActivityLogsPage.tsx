import { useCallback, useEffect, useMemo, useState } from 'react'
import { activityService } from '../services/settings'
import type { ActivityLog } from '../types'
import { formatDateTime, timeAgo } from '../utils/format'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge, type BadgeVariant } from '../components/ui/Badge'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { SelectDropdown } from '../components/ui/Dropdown'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import {
  ActivityIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeviceIcon,
  MapPinIcon,
  RefreshIcon,
  XIcon,
} from '../components/icons'

const ACTION_VARIANT: Record<string, BadgeVariant> = {
  CREATE: 'brand',
  UPDATE: 'neutral',
  DELETE: 'danger',
  PUBLISH: 'success',
  UNPUBLISH: 'warning',
  REVIEW: 'warning',
  LOGIN: 'info',
  LOGOUT: 'neutral',
  IMPORT: 'info',
  ASSIGN_ORG: 'info',
  REMOVE_ORG: 'warning',
  ASSIGN_ADMIN: 'info',
  UNASSIGN_ADMIN: 'warning',
  REVOKE: 'danger',
  SUBMIT: 'brand',
}

const ACTION_STYLE: Record<string, string> = {
  CREATE: 'bg-brand-soft text-brand',
  UPDATE: 'bg-soft text-muted',
  DELETE: 'bg-danger/10 text-danger',
  PUBLISH: 'bg-success/10 text-success',
  UNPUBLISH: 'bg-warning/10 text-warning',
  REVIEW: 'bg-warning/10 text-warning',
  LOGIN: 'bg-info/10 text-info',
  LOGOUT: 'bg-soft text-muted',
  IMPORT: 'bg-info/10 text-info',
  ASSIGN_ORG: 'bg-info/10 text-info',
  REMOVE_ORG: 'bg-warning/10 text-warning',
  ASSIGN_ADMIN: 'bg-info/10 text-info',
  UNASSIGN_ADMIN: 'bg-warning/10 text-warning',
  REVOKE: 'bg-danger/10 text-danger',
  SUBMIT: 'bg-brand-soft text-brand',
}

const RESOURCE_LABELS: Record<string, string> = {
  auth: 'Authentication',
  page: 'Pages',
  blog: 'Blogs',
  blogCategory: 'Blog Categories',
  event: 'Events',
  team: 'Team Members',
  testimonial: 'Testimonials',
  partner: 'Partners',
  faq: 'FAQs',
  award: 'Awards',
  location: 'Locations',
  donor: 'Donors',
  volunteer: 'Volunteers',
  beneficiary: 'Beneficiaries',
  department: 'Departments',
  campaign: 'Campaigns',
  gallery: 'Gallery',
  media: 'Media',
  settings: 'Settings',
  menu: 'Menus',
  banner: 'Banners',
  slider: 'Sliders',
  project: 'Projects',
  document: 'Documents',
  form: 'Forms',
  user: 'Users',
  organization: 'Organizations',
  role: 'Roles',
  donation: 'Donations',
  import: 'Imports',
  apiKey: 'API Keys',
  verification: 'Verifications',
  website: 'Websites',
  sectionTemplate: 'Section Templates',
  employee: 'Employees',
  account: 'Accounts',
  transaction: 'Transactions',
}

function parseUserAgent(ua: string | null | undefined): string {
  if (!ua) return 'Unknown device'
  if (/mobile/i.test(ua)) return 'Mobile browser'
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'Chrome'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  if (/edg/i.test(ua)) return 'Edge'
  return 'Unknown browser'
}

function formatJsonValues(obj: unknown): string {
  if (obj === null || obj === undefined) return '—'
  if (typeof obj === 'string') return obj || '—'
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj)
  if (Array.isArray(obj)) return obj.length ? obj.join(', ') : '—'
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined && v !== '')
    if (!entries.length) return '—'
    return entries.map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`).join(', ')
  }
  return String(obj)
}

function getChangedFields(before: unknown, after: unknown): { field: string; oldVal: string; newVal: string }[] {
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object') return []
  const changes: { field: string; oldVal: string; newVal: string }[] = []
  const b = before as Record<string, unknown>
  const a = after as Record<string, unknown>
  const allKeys = new Set([...Object.keys(b), ...Object.keys(a)])
  for (const key of allKeys) {
    const oldVal = b[key]
    const newVal = a[key]
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) continue
    changes.push({
      field: key,
      oldVal: formatJsonValues(oldVal),
      newVal: formatJsonValues(newVal),
    })
  }
  return changes
}

export function ActivityLogsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [detailItem, setDetailItem] = useState<ActivityLog | null>(null)

  const builtParams = useMemo(() => {
    const params: Record<string, string | number> = { page, limit: 20 }
    if (search.trim()) params.search = search.trim()
    if (actionFilter !== 'all') params.action = actionFilter
    if (resourceFilter !== 'all') params.resource = resourceFilter
    if (dateFilter !== 'all') {
      const now = new Date()
      if (dateFilter === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        params.from = start.toISOString()
      } else if (dateFilter === '7d') {
        params.from = new Date(now.getTime() - 7 * 86400000).toISOString()
      } else if (dateFilter === '30d') {
        params.from = new Date(now.getTime() - 30 * 86400000).toISOString()
      }
    }
    return params
  }, [page, search, actionFilter, resourceFilter, dateFilter])

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await activityService.list(builtParams as Parameters<typeof activityService.list>[0])
      setItems(result.items)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [builtParams])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [search, actionFilter, resourceFilter, dateFilter])

  const hasActiveFilters = actionFilter !== 'all' || resourceFilter !== 'all' || dateFilter !== 'all' || search.trim() !== ''

  const uniqueResources = useMemo(() => {
    const set = new Set<string>()
    for (const item of items) {
      if (item.resource) set.add(item.resource)
    }
    return Array.from(set).sort()
  }, [items])

  const uniqueUserIds = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of items) {
      if (item.user && !map.has(item.userId ?? '')) {
        const name = `${item.user.firstName} ${item.user.lastName ?? ''}`.trim()
        map.set(item.userId ?? '', name)
      }
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="System"
        title="Activity Logs"
        description="See who changed what in the CMS."
        actions={
          <Button
            variant="secondary"
            icon={<RefreshIcon />}
            onClick={() => {
              void load()
              toast('Activity log refreshed', { variant: 'info' })
            }}
          >
            Refresh
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search activities..."
            className="w-full sm:w-72"
          />
          <SelectDropdown
            label="Action"
            value={actionFilter}
            onChange={setActionFilter}
            options={[
              { value: 'all', label: 'All actions' },
              { value: 'CREATE', label: 'Create' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'DELETE', label: 'Delete' },
              { value: 'PUBLISH', label: 'Publish' },
              { value: 'UNPUBLISH', label: 'Unpublish' },
              { value: 'LOGIN', label: 'Login' },
              { value: 'LOGOUT', label: 'Logout' },
              { value: 'IMPORT', label: 'Import' },
            ]}
          />
          <SelectDropdown
            label="Resource"
            value={resourceFilter}
            onChange={setResourceFilter}
            options={[
              { value: 'all', label: 'All resources' },
              ...uniqueResources.map((r) => ({ value: r, label: RESOURCE_LABELS[r] || r })),
            ]}
          />
          <SelectDropdown
            label="Date"
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: 'all', label: 'All time' },
              { value: 'today', label: 'Today' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
            ]}
          />
          <span className="ml-auto text-xs font-semibold text-faint">
            {total} event{total === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="space-y-0 divide-y divide-line">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<ActivityIcon />}
            title="Unable to load activity logs"
            description="Something went wrong while fetching the activity data."
            action={
              <Button variant="secondary" onClick={() => void load()}>
                Try again
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ActivityIcon />}
            title={hasActiveFilters ? 'No activities match your filters' : 'No activities found'}
            description={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Activity will appear here as users make changes in the CMS.'}
            action={
              hasActiveFilters ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('')
                    setActionFilter('all')
                    setResourceFilter('all')
                    setDateFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {items.map((entry) => {
              const userName = entry.user
                ? `${entry.user.firstName} ${entry.user.lastName ?? ''}`.trim()
                : 'System'
              const actionKey = entry.action.toUpperCase().replace(/-/g, '') as string
              return (
                <li key={entry.id} className="flex flex-wrap items-start gap-3 px-5 py-4 transition hover:bg-row-hover">
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${ACTION_STYLE[actionKey] ?? 'bg-soft text-muted'}`}>
                    {entry.action.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {entry.message ?? `${entry.action} ${entry.resource}`}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="font-semibold text-ink">{userName}</span>
                      <Badge variant={ACTION_VARIANT[actionKey] ?? 'neutral'}>{entry.action}</Badge>
                      <span>{RESOURCE_LABELS[entry.resource] || entry.resource}</span>
                      <span className="text-faint">{timeAgo(entry.createdAt)}</span>
                    </div>
                  </div>
                  <div className="hidden shrink-0 flex-col items-end gap-1 text-[11px] text-faint md:flex">
                    <span className="flex items-center gap-1.5">
                      <DeviceIcon className="h-3 w-3" /> {parseUserAgent(entry.userAgent)}
                    </span>
                    {entry.ipAddress ? (
                      <span className="flex items-center gap-1.5">
                        <MapPinIcon className="h-3 w-3" /> {entry.ipAddress}
                      </span>
                    ) : null}
                    <span>{formatDateTime(entry.createdAt)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailItem(entry)}
                    className="mt-1 shrink-0 rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-soft hover:text-ink"
                  >
                    Details
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeftIcon />}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRightIcon />}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {detailItem && (
        <ActivityDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </div>
  )
}

function ActivityDetailModal({ item, onClose }: { item: ActivityLog; onClose: () => void }) {
  const userName = item.user
    ? `${item.user.firstName} ${item.user.lastName ?? ''}`.trim()
    : 'System'
  const changes = getChangedFields(item.before, item.after)
  const hasBeforeAfter = item.before && item.after && changes.length > 0

  return (
    <Modal open title="Activity Details" onClose={onClose} size="lg">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">User</p>
            <div className="mt-1.5 flex items-center gap-2">
              {item.user?.avatarUrl ? (
                <img src={item.user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-soft text-[10px] font-bold text-muted">
                  {userName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-ink">{userName}</p>
                {item.user?.email ? <p className="text-xs text-muted">{item.user.email}</p> : null}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Action</p>
            <div className="mt-1.5">
              <Badge variant={ACTION_VARIANT[item.action.toUpperCase()] ?? 'neutral'}>{item.action}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Resource</p>
            <p className="mt-1.5 text-sm text-ink">{RESOURCE_LABELS[item.resource] || item.resource}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Description</p>
            <p className="mt-1.5 text-sm text-ink">{item.message ?? '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Date & time</p>
            <p className="mt-1.5 text-sm text-ink">{formatDateTime(item.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Relative time</p>
            <p className="mt-1.5 text-sm text-ink">{timeAgo(item.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">IP address</p>
            <p className="mt-1.5 text-sm text-ink">{item.ipAddress || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Device / Browser</p>
            <p className="mt-1.5 text-sm text-ink">{parseUserAgent(item.userAgent)}</p>
          </div>
        </div>

        {hasBeforeAfter && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint mb-3">Changes</p>
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-soft">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">Field</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">Before</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {changes.map((c) => (
                    <tr key={c.field}>
                      <td className="px-3 py-2 font-medium text-ink">{c.field}</td>
                      <td className="px-3 py-2 text-danger/80">{c.oldVal}</td>
                      <td className="px-3 py-2 text-success/80">{c.newVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!hasBeforeAfter && item.before && (
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-faint hover:text-muted">
              Technical details
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-muted">
              {JSON.stringify(item.before, null, 2)}
            </pre>
          </details>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="secondary" onClick={onClose} icon={<XIcon />}>
          Close
        </Button>
      </div>
    </Modal>
  )
}
