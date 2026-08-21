import { useCallback, useEffect, useRef, useState } from 'react'
import type { AdminStatus, AdminUser } from '../types/admin'
import type { ManagedWebsite } from '../types/website'
import { adminService } from '../services/adminService'
import { websiteService } from '../services/websiteService'
import { CreateAdminModal } from '../components/admin/CreateAdminModal'
import { EditAdminModal } from '../components/admin/EditAdminModal'
import { DeleteAdminModal } from '../components/admin/DeleteAdminModal'
import { AddAdminSection } from '../components/admin/AddAdminSection'
import { Pagination } from '../components/ui/Pagination'
import { Button } from '../components/ui/Button'
import { Pill, type PillVariant } from '../components/ui/Pill'
import { useToast } from '../context/ToastContext'
import { useCurrentUserRole } from '../hooks/useCurrentUserRole'
import { useAuth } from '../context/AuthContext'
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from '../components/icons'

const ADMINS_UPDATED_EVENT = 'admins:updated'
const COPY_FEEDBACK_MS = 1500
const PAGE_SIZE = 5

const STATUS_PILL: Record<AdminStatus, { variant: PillVariant; label: string }> =
  {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'neutral', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    suspended: { variant: 'danger', label: 'Suspended' },
    disabled: { variant: 'danger', label: 'Disabled' },
  }

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export function AdminPage() {
  const toast = useToast()
  const { user } = useAuth()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [websites, setWebsites] = useState<ManagedWebsite[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [updatedAdminEmail, setUpdatedAdminEmail] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentRole = useCurrentUserRole()
  const canManage = currentRole === 'master'

  const totalPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageAdmins = admins.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const loadAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const [adminResult, websiteResult] = await Promise.all([
        adminService.list(),
        websiteService.list(),
      ])
      setAdmins(adminResult)
      setWebsites(websiteResult)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAdmins()
    window.addEventListener(ADMINS_UPDATED_EVENT, loadAdmins)
    return () => {
      window.removeEventListener(ADMINS_UPDATED_EVENT, loadAdmins)
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [loadAdmins])

  const handleAdminCreated = (admin: AdminUser) => {
    setAdmins((current) => [...current, admin])
  }

  const handleAdminUpdated = (updated: AdminUser) => {
    setAdmins((current) =>
      current.map((admin) => (admin.id === updated.id ? updated : admin)),
    )
    setUpdatedAdminEmail(updated.email)
  }

  const handleAdminDeleted = (deleted: AdminUser) => {
    setAdmins((current) =>
      current.filter((admin) => admin.id !== deleted.id),
    )
  }

  const managedSiteNames = (admin: AdminUser): string[] => {
    const ids = new Set(admin.managedWebsites ?? [])
    return websites
      .filter((website) => ids.has(website.id))
      .map((website) => website.name)
  }

  const masters = admins.filter((admin) => admin.role === 'master')
  const isLastMaster =
    deletingAdmin?.role === 'master' && masters.length <= 1
  const isSelf = deletingAdmin?.id === user?.id

  const copyCredentials = async (admin: AdminUser) => {
    try {
      await navigator.clipboard.writeText(admin.email)
      setCopiedId(admin.id)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(
        () => setCopiedId(null),
        COPY_FEEDBACK_MS,
      )
      toast.success({
        title: 'Email copied',
        description: `Copied login email for "${admin.email}".`,
      })
    } catch {
      toast.error({ title: 'Could not copy email' })
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4 animate-rise">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-[-0.02em] text-gray-900">
            Admin
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Admin users created on the platform and the websites they manage.
          </p>
        </div>
        <Button variant="violet" onClick={() => setModalOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add admin
        </Button>
      </header>

      <div className="mb-8">
        <AddAdminSection
          websites={websites}
          onCreated={handleAdminCreated}
          updatedAdminEmail={updatedAdminEmail}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-soft" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <UsersIcon className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold text-ink">No admins yet</p>
          <p className="mt-1 text-sm text-muted">
            Click “Add admin” to create your first admin user.
          </p>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(true)}
            className="mt-5"
          >
            <PlusIcon className="h-4 w-4" />
            Add admin
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Admin
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
                  className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Managed websites
                </th>
                <th
                  scope="col"
                  className="border-b-2 border-line px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft">
              {pageAdmins.map((admin) => {
                const isCopied = copiedId === admin.id
                const sites = managedSiteNames(admin)
                return (
                  <tr
                    key={admin.id}
                    className="transition-colors duration-150 hover:bg-row-hover"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                          {admin.email.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-medium text-ink">
                          {admin.email}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Pill variant="brand">
                        {admin.role === 'master' ? 'Master Admin' : 'Site Admin'}
                      </Pill>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Pill
                        variant={STATUS_PILL[admin.status].variant}
                        dot
                      >
                        {STATUS_PILL[admin.status].label}
                      </Pill>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {sites.length > 0 ? (
                          sites.map((name) => (
                            <Pill key={name} variant="neutral">
                              {name}
                            </Pill>
                          ))
                        ) : (
                          <span className="text-xs text-faint">
                            No sites assigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                          {isCopied ? 'Copied!' : 'Copy email'}
                        </button>
                        {canManage ? (
                          <>
                            <button
                              type="button"
                              aria-label={`Edit ${admin.email}`}
                              title="Edit admin"
                              onClick={() => setEditingAdmin(admin)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-soft hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${admin.email}`}
                              title="Delete admin"
                              onClick={() => setDeletingAdmin(admin)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-danger/10 hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : null}
                      </div>
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
      )}

      <CreateAdminModal
        open={modalOpen}
        websites={websites}
        onClose={() => setModalOpen(false)}
        onCreated={handleAdminCreated}
      />

      <EditAdminModal
        open={editingAdmin !== null}
        admin={editingAdmin}
        websites={websites}
        onClose={() => setEditingAdmin(null)}
        onUpdated={handleAdminUpdated}
      />

      <DeleteAdminModal
        open={deletingAdmin !== null}
        admin={deletingAdmin}
        websites={websites}
        isLastMaster={isLastMaster}
        isSelf={isSelf}
        onClose={() => setDeletingAdmin(null)}
        onDeleted={handleAdminDeleted}
      />
    </div>
  )
}
