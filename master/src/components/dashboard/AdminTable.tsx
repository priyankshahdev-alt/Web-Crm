import { useEffect, useRef, useState } from 'react'
import type { AdminUser } from '../../types/admin'
import { useToast } from '../../context/ToastContext'
import { Pill } from '../ui/Pill'
import { Pagination } from '../ui/Pagination'
import { CheckIcon, CopyIcon } from '../icons'

interface AdminTableProps {
  admins: AdminUser[]
  loading: boolean
}

const COPY_FEEDBACK_MS = 1500
const PAGE_SIZE = 5

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export function AdminTable({ admins, loading }: AdminTableProps) {
  const toast = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageAdmins = admins.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    },
    [],
  )

  const copyCredentials = async (admin: AdminUser) => {
    try {
      await navigator.clipboard.writeText(
        `Username: ${admin.username}\nPassword: ${admin.password}`,
      )
      setCopiedId(admin.id)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(
        () => setCopiedId(null),
        COPY_FEEDBACK_MS,
      )
      toast.success({
        title: 'Credentials copied',
        description: `Copied login details for "${admin.username}".`,
      })
    } catch {
      toast.error({ title: 'Could not copy credentials' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-2xl bg-soft"
          />
        ))}
      </div>
    )
  }

  if (admins.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center shadow-card">
        <p className="text-sm font-medium text-ink">No admins yet</p>
        <p className="mt-1 text-sm text-muted">
          Create your first admin user to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
            >
              Username
            </th>
            <th
              scope="col"
              className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
            >
              Role
            </th>
            <th
              scope="col"
              className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
            >
              Status
            </th>
            <th
              scope="col"
              className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
            >
              Created
            </th>
            <th
              scope="col"
              className="border-b-2 border-line px-5 py-3.5 text-right"
            >
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-soft">
          {pageAdmins.map((admin) => {
            const isCopied = copiedId === admin.id
            return (
              <tr
                key={admin.id}
                className="transition-colors duration-150 hover:bg-row-hover"
              >
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-ink">
                      {admin.username}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <Pill variant="brand">
                    {admin.role === 'master' ? 'Master Admin' : 'Site Admin'}
                  </Pill>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {admin.status === 'active' ? (
                    <Pill variant="success" dot>
                      Active
                    </Pill>
                  ) : (
                    <Pill variant="danger" dot>
                      Disabled
                    </Pill>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted">
                  {formatDate(admin.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => copyCredentials(admin)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      isCopied
                        ? 'bg-success/10 text-success'
                        : 'text-brand hover:bg-brand-soft'
                    }`}
                  >
                    {isCopied ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <CopyIcon className="h-3.5 w-3.5" />
                    )}
                    {isCopied ? 'Copied!' : 'Copy credentials'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      <Pagination
        page={page}
        totalItems={admins.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  )
}
