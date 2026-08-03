import { useState } from 'react'
import type { AdminUser } from '../../types/admin'
import { MANAGED_WEBSITES } from '../../data/websites'
import { adminService } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { TrashIcon } from '../icons'

interface DeleteAdminModalProps {
  open: boolean
  admin: AdminUser | null
  isLastMaster: boolean
  isSelf: boolean
  onClose: () => void
  onDeleted: (admin: AdminUser) => void
}

export function DeleteAdminModal({
  open,
  admin,
  isLastMaster,
  isSelf,
  onClose,
  onDeleted,
}: DeleteAdminModalProps) {
  const toast = useToast()
  const [deleting, setDeleting] = useState(false)

  const blocked = isLastMaster || isSelf
  const managedSiteIds = admin?.managedWebsites ?? MANAGED_WEBSITES.map((s) => s.id)
  const managedSites = MANAGED_WEBSITES.filter((site) =>
    managedSiteIds.includes(site.id),
  )

  const handleConfirm = async () => {
    if (!admin || blocked) return

    setDeleting(true)
    try {
      await adminService.remove(admin.id)
      toast.success({
        title: 'Admin deleted',
        description: `Admin user "${admin.username}" was removed.`,
      })
      onDeleted(admin)
      onClose()
    } catch {
      toast.error({ title: 'Could not delete admin' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete this admin?"
      description="This action cannot be undone."
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={deleting}
            disabled={blocked}
          >
            Delete Admin
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <TrashIcon className="h-6 w-6" />
        </div>

        <p className="text-sm text-muted">
          This will permanently remove{' '}
          <span className="font-semibold text-ink">{admin?.username}</span> and
          revoke their access to{' '}
          <span className="font-semibold text-ink">
            {managedSites.length} managed website
            {managedSites.length === 1 ? '' : 's'}
          </span>
          . This action cannot be undone.
        </p>

        {managedSites.length > 0 ? (
          <div className="rounded-xl border border-warning/25 bg-warning/10 px-3.5 py-3">
            <p className="text-xs font-semibold text-warning">
              Access will be revoked from these websites:
            </p>
            <ul className="mt-1.5 space-y-1">
              {managedSites.map((site) => (
                <li key={site.id} className="text-sm text-ink">
                  {site.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {isLastMaster ? (
          <p className="rounded-xl bg-danger/10 px-3.5 py-3 text-sm font-medium text-danger">
            You cannot delete the only Master Admin account.
          </p>
        ) : null}

        {isSelf ? (
          <p className="rounded-xl bg-danger/10 px-3.5 py-3 text-sm font-medium text-danger">
            You cannot delete your own account.
          </p>
        ) : null}
      </div>
    </Modal>
  )
}
