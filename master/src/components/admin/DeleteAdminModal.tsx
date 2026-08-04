import { useEffect, useState, type FormEvent } from 'react'
import type { AdminUser } from '../../types/admin'
import type { ManagedWebsite } from '../../types/website'
import { adminService } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'

interface DeleteAdminModalProps {
  open: boolean
  admin: AdminUser | null
  websites: ManagedWebsite[]
  isLastMaster: boolean
  isSelf: boolean
  onClose: () => void
  onDeleted: (admin: AdminUser) => void
}

export function DeleteAdminModal({
  open,
  admin,
  onClose,
  onDeleted,
}: DeleteAdminModalProps) {
  const toast = useToast()
  const [deleting, setDeleting] = useState(false)

  const managedSiteIds = admin?.managedWebsites ?? MANAGED_WEBSITES.map((s) => s.id)
  const managedSites = MANAGED_WEBSITES.filter((site) =>
    managedSiteIds.includes(site.id),
  )

  const handleConfirm = async () => {
    if (!admin) return

    setSubmitting(true)
    try {
      await adminService.remove(admin.id)
      toast.success({
        title: 'Admin deleted',
        description: `"${admin.email}" was permanently deleted.`,
      })
      onDeleted(admin)
      onClose()
    } catch (err) {
      const { message } = adminService.errorMessage(err)
      toast.error({ title: 'Could not delete admin', description: message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Admin"
      description={
        blocked
          ? isLastMaster
            ? 'This is the last Master Admin and cannot be deleted. At least one Master Admin must always exist.'
            : 'You cannot delete your own account from this panel.'
          : 'This permanently deletes the admin user and their website assignments.'
      }
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="delete-admin-form"
            variant="danger"
            onClick={handleConfirm}
            loading={deleting}
          >
            Delete Admin
          </Button>
        </>
      }
    >
      {blocked ? (
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
      </div>
    </Modal>
  )
}
