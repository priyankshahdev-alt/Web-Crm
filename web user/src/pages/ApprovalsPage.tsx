import { useCallback, useEffect, useMemo, useState } from 'react'
import { approvalService } from '../services/settings'
import type { ApprovalRequest, ApprovalStatus } from '../types'
import { timeAgo, formatDateTime } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { useSession } from '../context/SessionContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Tabs } from '../components/ui/Tabs'
import { SearchInput } from '../components/ui/SearchInput'
import { SelectDropdown } from '../components/ui/Dropdown'
import {
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  PencilIcon,
  EyeIcon,
  RefreshIcon,
  CalendarIcon,
  ImageIcon,
} from '../components/icons'

const RESOURCE_ICONS: Record<string, typeof FileTextIcon> = {
  page: FileTextIcon,
  blog: FileTextIcon,
  event: CalendarIcon,
  project: FileTextIcon,
  gallery: ImageIcon,
  team: PencilIcon,
  testimonial: FileTextIcon,
  form: FileTextIcon,
  settings: PencilIcon,
}

const RESOURCE_LABELS: Record<string, string> = {
  page: 'Page',
  blog: 'Blog',
  event: 'Event',
  project: 'Program',
  gallery: 'Gallery',
  team: 'Team Member',
  testimonial: 'Testimonial',
  form: 'Form',
  settings: 'Settings',
}

const EVENT_ACTION_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted for review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CHANGES_REQUESTED: 'Changes requested',
  RESUBMITTED: 'Resubmitted',
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CHANGES_REQUESTED', label: 'Changes Requested' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const RESOURCE_OPTIONS = [
  { value: 'ALL', label: 'All Types' },
  { value: 'page', label: 'Pages' },
  { value: 'blog', label: 'Blogs' },
  { value: 'event', label: 'Events' },
  { value: 'project', label: 'Programs' },
  { value: 'gallery', label: 'Galleries' },
  { value: 'team', label: 'Team Members' },
  { value: 'testimonial', label: 'Testimonials' },
  { value: 'form', label: 'Forms' },
]

const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
]

function displayName(u?: { firstName: string; lastName?: string | null } | null) {
  if (!u) return 'Unknown'
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
}

function getDateRange(value: string): { from?: string; to?: string } {
  if (value === 'all') return {}
  const now = new Date()
  if (value === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return { from: start.toISOString() }
  }
  const days = value === '7d' ? 7 : 30
  const start = new Date(now.getTime() - days * 86400000)
  return { from: start.toISOString() }
}

export function ApprovalsPage() {
  const { toast } = useToast()
  const { session } = useSession()
  const [items, setItems] = useState<ApprovalRequest[]>([])
  const [total, setTotal] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'PENDING' | 'ALL'>('PENDING')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('all')

  const [reviewing, setReviewing] = useState<ApprovalRequest | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const dateRange = getDateRange(dateFilter)
      const result = await approvalService.list({
        page,
        limit: 20,
        status: tab === 'PENDING' ? 'PENDING' : statusFilter !== 'ALL' ? statusFilter : undefined,
        resourceType: typeFilter !== 'ALL' ? typeFilter : undefined,
        search: search || undefined,
        from: dateRange.from,
        to: dateRange.to,
      })
      setItems(result.items)
      setTotal(result.total)
      setPendingCount(result.pendingCount)
    } catch {
      setError('Unable to load approval requests.')
    } finally {
      setLoading(false)
    }
  }, [page, tab, search, statusFilter, typeFilter, dateFilter])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [tab, search, statusFilter, typeFilter, dateFilter])

  const totalPages = Math.max(1, Math.ceil(total / 20))

  const openReview = (item: ApprovalRequest) => {
    setReviewing(item)
    setReviewNote('')
    setShowRejectConfirm(false)
    setShowPublishConfirm(false)
  }

  const closeReview = () => {
    setReviewing(null)
    setReviewNote('')
    setShowRejectConfirm(false)
    setShowPublishConfirm(false)
  }

  const handleReview = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!reviewing) return
    if (decision === 'REJECTED' && !reviewNote.trim()) {
      toast('Please provide a reason for rejection.', { variant: 'warning' })
      return
    }
    setSubmitting(true)
    try {
      await approvalService.review(reviewing.id, decision, reviewNote || undefined)
      const labels: Record<string, string> = {
        APPROVED: 'Content approved successfully',
        REJECTED: 'Request rejected',
      }
      toast(labels[decision], {
        variant: decision === 'APPROVED' ? 'success' : 'danger',
        description: reviewing.resourceTitle,
      })
      closeReview()
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Action failed'
      toast(message, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('ALL')
    setTypeFilter('ALL')
    setDateFilter('all')
  }

  const hasFilters = search || statusFilter !== 'ALL' || typeFilter !== 'ALL' || dateFilter !== 'all'

  const rendersubmitterMessage = (item: ApprovalRequest) => {
    if (!item.submitterNote) return null
    return (
      <p className="mt-1.5 text-xs italic text-muted line-clamp-2">
        "{item.submitterNote}"
      </p>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="System"
        title="Approval Requests"
        description="Review and approve content before it goes live on the website."
      />

      <Tabs
        className="mb-5"
        tabs={[
          { id: 'PENDING', label: 'Pending', count: pendingCount },
          { id: 'ALL', label: 'All requests', count: total },
        ]}
        active={tab}
        onChange={(value) => { setTab(value as typeof tab); setPage(1) }}
      />

      {tab === 'ALL' && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by title, submitter, type..."
            />
          </div>
          <SelectDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
          />
          <SelectDropdown
            value={typeFilter}
            onChange={setTypeFilter}
            options={RESOURCE_OPTIONS}
          />
          <SelectDropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={DATE_OPTIONS}
          />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <EmptyState
            icon={<XCircleIcon />}
            title="Unable to load approval requests"
            description={error}
            action={<Button variant="secondary" icon={<RefreshIcon />} onClick={() => void load()}>Try again</Button>}
          />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CheckCircleIcon />}
            title={
              tab === 'PENDING'
                ? 'No approval requests waiting for review.'
                : hasFilters
                  ? 'No requests match your filters.'
                  : 'No approval requests found.'
            }
            description={
              tab === 'PENDING'
                ? 'All caught up — nothing needs your attention right now.'
                : hasFilters
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Approval requests will appear here when content is submitted for review.'
            }
            action={hasFilters ? <Button variant="secondary" onClick={clearFilters}>Clear filters</Button> : undefined}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = RESOURCE_ICONS[item.resourceType] ?? FileTextIcon
            return (
              <Card key={item.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-ink">{item.resourceTitle}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {RESOURCE_LABELS[item.resourceType] ?? item.resourceType}
                        {' · '}
                        {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                        {' · '}
                        submitted by{' '}
                        <span className="font-semibold text-ink">{displayName(item.submitter)}</span>
                        {' · '}
                        {timeAgo(item.submittedAt)}
                      </p>
                      {rendersubmitterMessage(item)}
                      {item.status !== 'PENDING' && item.reviewer ? (
                        <p className="mt-1.5 text-xs text-faint">
                          Reviewed by <span className="font-semibold text-ink">{displayName(item.reviewer)}</span>
                          {' · '}
                          {item.reviewedAt ? formatDateTime(item.reviewedAt) : ''}
                          {item.reviewerNote ? (
                            <span className="italic"> — {item.reviewerNote}</span>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="secondary" size="sm" icon={<EyeIcon />} onClick={() => openReview(item)}>
                      Review
                    </Button>
                  </div>
                </div>

                {item.events.length > 0 && (
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-faint">Timeline</p>
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {item.events.map((event, index) => (
                        <li key={event.id} className="flex items-center gap-2 text-xs">
                          {index > 0 ? <span className="text-faint">→</span> : null}
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                event.action === 'APPROVED'
                                  ? 'bg-success'
                                  : event.action === 'REJECTED'
                                    ? 'bg-danger'
                                    : event.action === 'CHANGES_REQUESTED'
                                      ? 'bg-info'
                                      : 'bg-warning'
                              }`}
                            />
                            <span className="font-semibold text-ink">{event.actorName}</span>
                            <span className="text-muted">{EVENT_ACTION_LABELS[event.action] ?? event.action}</span>
                            <span className="text-faint">{timeAgo(event.createdAt)}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </Card>
            )
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-muted">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        open={reviewing !== null}
        onClose={closeReview}
        title="Review request"
        description={reviewing?.resourceTitle}
        size="lg"
        footer={
          reviewing?.status === 'PENDING' ? (
            <>
              <Button variant="ghost" onClick={closeReview}>
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  icon={<XCircleIcon />}
                  loading={submitting}
                  onClick={() => setShowRejectConfirm(true)}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  icon={<CheckCircleIcon />}
                  loading={submitting}
                  onClick={() => setShowPublishConfirm(true)}
                >
                  Approve
                </Button>
              </div>
            </>
          ) : (
            <Button variant="secondary" onClick={closeReview}>Close</Button>
          )
        }
      >
        {reviewing && (
          <div className="space-y-5">
            {/* Request info */}
            <div className="rounded-xl border border-line bg-slate-50 p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Content Type</p>
                  <p className="mt-0.5 font-medium text-ink">{RESOURCE_LABELS[reviewing.resourceType] ?? reviewing.resourceType}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Action</p>
                  <p className="mt-0.5 font-medium text-ink">{reviewing.action.charAt(0).toUpperCase() + reviewing.action.slice(1)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Submitted By</p>
                  <p className="mt-0.5 font-medium text-ink">{displayName(reviewing.submitter)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Submitted</p>
                  <p className="mt-0.5 font-medium text-ink">{formatDateTime(reviewing.submittedAt)}</p>
                </div>
              </div>
              {reviewing.submitterNote && (
                <div className="mt-3 border-t border-line pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Submitter's Message</p>
                  <p className="mt-1 text-sm text-ink italic">"{reviewing.submitterNote}"</p>
                </div>
              )}
            </div>

            {/* Content preview */}
            {reviewing.contentSnapshot && (
              <div className="rounded-xl border border-line bg-white p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-faint">Content Preview</p>
                <div className="space-y-2 text-sm">
                  {Object.entries(reviewing.contentSnapshot).map(([key, value]) => {
                    if (value === null || value === undefined || value === '') return null
                    const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
                    if (displayValue.length > 500) return null
                    return (
                      <div key={key} className="flex gap-3">
                        <span className="w-32 shrink-0 text-xs font-semibold capitalize text-muted">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-xs text-ink break-words">{displayValue}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Review note input (only for pending) */}
            {reviewing.status === 'PENDING' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted">
                  Review note (optional)
                </label>
                <Textarea
                  rows={3}
                  value={reviewNote}
                  placeholder="Add a note for the submitter..."
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
            )}

            {/* Timeline */}
            {reviewing.events.length > 0 && (
              <div className="rounded-xl border border-line bg-slate-50 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-faint">Activity History</p>
                <div className="space-y-3">
                  {reviewing.events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 text-xs">
                      <span
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          event.action === 'APPROVED'
                            ? 'bg-success'
                            : event.action === 'REJECTED'
                              ? 'bg-danger'
                              : event.action === 'CHANGES_REQUESTED'
                                ? 'bg-info'
                                : 'bg-warning'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink">{event.actorName}</span>
                          <span className="text-muted">{EVENT_ACTION_LABELS[event.action] ?? event.action}</span>
                        </div>
                        {event.note && (
                          <p className="mt-0.5 italic text-muted">"{event.note}"</p>
                        )}
                        <p className="mt-0.5 text-faint">{formatDateTime(event.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publish Confirm */}
            {showPublishConfirm && (
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <p className="text-sm font-semibold text-ink">Approve this content?</p>
                <p className="mt-1 text-xs text-muted">This will publish the content and make it live on the website.</p>
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowPublishConfirm(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircleIcon />}
                    loading={submitting}
                    onClick={() => void handleReview('APPROVED')}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}

            {/* Reject Confirm */}
            {showRejectConfirm && (
              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <p className="text-sm font-semibold text-ink">Why are you rejecting this request?</p>
                <Textarea
                  rows={2}
                  className="mt-2"
                  value={reviewNote}
                  placeholder="Provide a reason for rejection..."
                  onChange={(e) => setReviewNote(e.target.value)}
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setShowRejectConfirm(false); setReviewNote('') }}>Cancel</Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircleIcon />}
                    loading={submitting}
                    onClick={() => void handleReview('REJECTED')}
                  >
                    Reject Request
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>
    </div>
  )
}
