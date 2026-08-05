import { useCallback, useEffect, useMemo, useState } from 'react'
import { approvalService } from '../services/settings'
import type { ApprovalRequest } from '../types'
import { timeAgo, formatDateTime } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { useSession } from '../context/SessionContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge, Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Field, Textarea } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Tabs } from '../components/ui/Tabs'
import {
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  PencilIcon,
  EyeIcon,
} from '../components/icons'

const TYPE_BADGE: Record<string, 'brand' | 'warning'> = {
  publish: 'brand',
  edit: 'warning',
}

export function ApprovalsPage() {
  const { toast } = useToast()
  const { session } = useSession()
  const [items, setItems] = useState<ApprovalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'PENDING' | 'ALL'>('PENDING')
  const [reviewing, setReviewing] = useState<ApprovalRequest | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setItems(await approvalService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const visible = useMemo(
    () => (tab === 'PENDING' ? items.filter((item) => item.status === 'PENDING') : items),
    [items, tab],
  )

  const counts = useMemo(
    () => ({
      PENDING: items.filter((item) => item.status === 'PENDING').length,
      ALL: items.length,
    }),
    [items],
  )

  const openReview = (item: ApprovalRequest) => {
    setReviewing(item)
    setNote('')
  }

  const review = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!reviewing) return
    const reviewer = session
      ? [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') || session.user.email
      : 'Admin'
    setSubmitting(true)
    try {
      await approvalService.review(reviewing.id, decision, note, reviewer)
      toast(
        decision === 'APPROVED' ? 'Request approved' : 'Request rejected',
        {
          variant: decision === 'APPROVED' ? 'success' : 'info',
          description: reviewing.title,
        },
      )
      setReviewing(null)
      await load()
    } finally {
      setSubmitting(false)
    }
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
          { id: 'PENDING', label: 'Pending', count: counts.PENDING },
          { id: 'ALL', label: 'All requests', count: counts.ALL },
        ]}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CheckCircleIcon />}
            title={tab === 'PENDING' ? 'All caught up!' : 'No requests yet'}
            description={tab === 'PENDING' ? 'Nothing is waiting for your review.' : 'Approved and rejected requests will appear here.'}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    {item.type === 'publish' ? <FileTextIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                      <Badge variant={TYPE_BADGE[item.type] ?? 'neutral'}>{item.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {item.resource} · submitted by{' '}
                      <span className="font-semibold text-ink">{item.submittedBy}</span> · {timeAgo(item.submittedAt)}
                    </p>
                    {item.comment ? <p className="mt-1.5 text-xs italic text-muted">"{item.comment}"</p> : null}
                    {item.status !== 'PENDING' && item.reviewedBy ? (
                      <p className="mt-1.5 text-xs text-faint">
                        Reviewed by <span className="font-semibold text-ink">{item.reviewedBy}</span> · {formatDateTime(item.reviewedAt)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={item.status} />
                  {item.status === 'PENDING' ? (
                    <>
                      <Button variant="secondary" size="sm" icon={<XCircleIcon />} onClick={() => openReview(item)}>
                        Review
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              {item.timeline.length > 0 ? (
                <div className="mt-4 border-t border-line pt-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-faint">Timeline</p>
                  <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {item.timeline.map((entry, index) => (
                      <li key={entry.id} className="flex items-center gap-2 text-xs">
                        {index > 0 ? <span className="text-faint">→</span> : null}
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              entry.action === 'Approved'
                                ? 'bg-success'
                                : entry.action === 'Rejected'
                                  ? 'bg-danger'
                                  : 'bg-warning'
                            }`}
                          />
                          <span className="font-semibold text-ink">{entry.actor}</span>
                          <span className="text-muted">{entry.action}</span>
                          <span className="text-faint">{timeAgo(entry.at)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={reviewing !== null}
        onClose={() => setReviewing(null)}
        title="Review request"
        description={reviewing?.title}
        size="md"
        footer={
          <>
            <Button
              variant="danger"
              icon={<XCircleIcon />}
              loading={submitting}
              onClick={() => void review('REJECTED')}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              icon={<CheckCircleIcon />}
              loading={submitting}
              onClick={() => void review('APPROVED')}
            >
              Approve
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-muted">
            <EyeIcon className="h-4 w-4 shrink-0 text-brand" />
            <span>
              Submitting your decision will{' '}
              <span className="font-semibold text-ink">
                {reviewing?.type === 'publish' ? 'publish the content' : 'apply the change'}
              </span>{' '}
              on the live site immediately.
            </span>
          </div>
          <Field label="Review note (optional)" htmlFor="review-note" hint="Visible to the submitter in the timeline">
            <Textarea
              id="review-note"
              rows={3}
              value={note}
              placeholder="e.g. Approved — great work!"
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <div className="rounded-xl border border-line bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Timeline</p>
            <ul className="mt-2 space-y-1.5">
              {reviewing?.timeline.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2 text-xs text-muted">
                  <span className="font-semibold text-ink">{entry.actor}</span>
                  <span>{entry.action}</span>
                  {entry.note ? <span className="italic text-faint">— {entry.note}</span> : null}
                  <span className="ml-auto text-faint">{timeAgo(entry.at)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  )
}
