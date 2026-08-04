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
  websites,
  isLastMaster,
  isSelf,
  onClose,
  onDeleted,
}: DeleteAdminModalProps) {
  const toast = useToast()
  const [confirmText, setConfirmText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setConfirmText('')
  }, [open])

  const managedSiteNames =
    admin?.managedWebsites
      ?.map((id) => websites.find((site) => site.id === id)?.name ?? id)
      .filter(Boolean) ?? []

  const canConfirm = confirmText === admin?.email
  const blocked = isLastMaster || isSelf

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!admin || blocked || !canConfirm) return

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
            loading={submitting}
            disabled={!canConfirm}
          >
            Delete Admin
          </Button>
        </>
      }
    >
      {blocked ? (
        <p className="text-sm text-muted">
          {isLastMaster
            ? 'Create another Master Admin before attempting to delete this one.'
            : 'Use the account settings page to deactivate your own account if needed.'}
        </p>
      ) : (
        <form id="delete-admin-form" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="rounded-xl bg-danger/5 px-4 py-3 text-sm text-danger">
              <p className="font-semibold">Deleting {admin?.email}</p>
              {managedSiteNames.length > 0 ? (
                <p className="mt-1 text-xs text-muted">
                  Managed sites: {managedSiteNames.join(', ')}
                </p>
              ) : null}
            </div>
            <Input
              label={`Type "${admin?.email}" to confirm`}
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              error={!canConfirm && confirmText.length > 0 ? 'Email does not match' : undefined}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </form>
      )}
    </Modal>
  )
}
