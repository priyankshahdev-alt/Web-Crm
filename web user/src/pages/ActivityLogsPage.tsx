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
import { ActivityIcon, DeviceIcon, MapPinIcon, RefreshIcon } from '../components/icons'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

const ACTION_STYLE: Record<ActivityLog['action'], string> = {
  CREATE: 'bg-brand-soft text-brand',
  UPDATE: 'bg-soft text-muted',
  DELETE: 'bg-danger/10 text-danger',
  PUBLISH: 'bg-success/10 text-success',
  REVIEW: 'bg-warning/10 text-warning',
  LOGIN: 'bg-brand-soft text-brand',
  LOGOUT: 'bg-soft text-muted',
}

const ACTION_VARIANT: Record<ActivityLog['action'], BadgeVariant> = {
  CREATE: 'brand',
  UPDATE: 'neutral',
  DELETE: 'danger',
  PUBLISH: 'success',
  REVIEW: 'warning',
  LOGIN: 'brand',
  LOGOUT: 'neutral',
}

export function ActivityLogsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    setItems(await activityService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((entry) => {
      if (action !== 'all' && entry.action !== action) return false
      if (!q) return true
      return [entry.userName, entry.resource, entry.message]
        .filter(Boolean)
        .some((value) => (value as string).toLowerCase().includes(q))
    })
  }, [items, search, action])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="System"
        title="Activity Logs"
        description="A full audit trail of every change made in the CMS."
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
            placeholder="Search by user, resource or message..."
            className="w-full sm:w-80"
          />
          <SelectDropdown
            label="Action"
            value={action}
            onChange={setAction}
            options={[
              { value: 'all', label: 'All' },
              { value: 'CREATE', label: 'Create' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'DELETE', label: 'Delete' },
              { value: 'PUBLISH', label: 'Publish' },
              { value: 'REVIEW', label: 'Review' },
              { value: 'LOGIN', label: 'Login' },
              { value: 'LOGOUT', label: 'Logout' },
            ]}
          />
          <span className="ml-auto text-xs font-semibold text-faint">
            {visible.length} event{visible.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="space-y-0 divide-y divide-line">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState icon={<ActivityIcon />} title="No activity found" description="Try adjusting your search or filters." />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-start gap-3 px-5 py-4 transition hover:bg-row-hover">
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${ACTION_STYLE[entry.action]}`}>
                  {entry.action.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {entry.message ?? `${entry.action} ${entry.resource}`}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span className="font-semibold text-ink">{entry.userName}</span>
                    <Badge variant={ACTION_VARIANT[entry.action]}>{entry.action}</Badge>
                    <span>{entry.resource}</span>
                    <span className="text-faint">{timeAgo(entry.createdAt)}</span>
                  </div>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-[11px] text-faint md:flex">
                  <span className="flex items-center gap-1.5">
                    <DeviceIcon className="h-3 w-3" /> {entry.device}
                  </span>
                  {entry.ipAddress ? (
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="h-3 w-3" /> {entry.ipAddress}
                    </span>
                  ) : null}
                  <span>{formatDateTime(entry.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
