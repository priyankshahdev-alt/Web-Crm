import { useEffect, useState, type FormEvent } from 'react'
import type { AdminStatus, AdminUser } from '../../types/admin'
import type { ManagedWebsite } from '../../types/website'
import { adminService } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'

interface EditAdminModalProps {
  open: boolean
  admin: AdminUser | null
  websites: ManagedWebsite[]
  onClose: () => void
  onUpdated: (admin: AdminUser) => void
}

export function EditAdminModal({
  open,
  admin,
  websites,
  onClose,
  onUpdated,
}: EditAdminModalProps) {
  const toast = useToast()
  const [status, setStatus] = useState<AdminStatus>('active')
  const [managedWebsites, setManagedWebsites] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && admin) {
      setStatus(admin.status)
      setManagedWebsites([...(admin.managedWebsites ?? [])])
      setPassword('')
    }
  }, [open, admin])

  const toggleSite = (siteId: string) => {
    setManagedWebsites((current) =>
      current.includes(siteId)
        ? current.filter((id) => id !== siteId)
        : [...current, siteId],
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!admin) return

    setSubmitting(true)
    try {
      const updated = await adminService.update(admin.id, {
        email: admin.email,
        status,
        managedWebsites,
        ...(password ? { password } : {}),
      })
      onUpdated(updated)
      onClose()
    } catch (err) {
      const { message } = adminService.errorMessage(err)
      toast.error({ title: 'Could not update admin', description: message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Admin"
      description={
        admin
          ? `Manage access and managed websites for ${admin.email}.`
          : 'Manage access and managed websites.'
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
          <Button type="submit" form="edit-admin-form" loading={submitting}>
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-admin-form" onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={admin?.email ?? ''}
            disabled
            hint="Email is used as the sign-in identifier and cannot be changed here."
          />

          <Input
            label="New password (optional)"
            type="password"
            revealable
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            placeholder="Leave blank to keep the current password"
            hint="Must be at least 8 characters. The admin must sign in again after a reset."
          />

          <div>
            <span className="block text-sm font-medium text-ink">Status</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                  status === 'active'
                    ? 'border-brand/30 bg-brand-soft/50 text-brand'
                    : 'border-line text-muted hover:bg-soft'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Active
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('disabled')}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                  status === 'disabled'
                    ? 'border-danger/30 bg-danger/10 text-danger'
                    : 'border-line text-muted hover:bg-soft'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  Disabled
                </span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-ink">
                Managed websites
              </label>
              <span className="text-xs text-muted">
                {managedWebsites.length} selected
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {websites.map((site) => {
                const checked = managedWebsites.includes(site.id)
                return (
                  <label
                    key={site.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                      checked
                        ? 'border-brand/30 bg-brand-soft/50'
                        : 'border-line hover:bg-soft'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSite(site.id)}
                      className="h-4 w-4 rounded border-line accent-brand focus:ring-brand"
                    />
                    <span className="text-sm font-medium text-ink">
                      {site.name}
                    </span>
                    <span className="ml-auto text-xs text-faint">{site.url}</span>
                  </label>
                )
              })}
              {websites.length === 0 ? (
                <p className="text-xs text-faint">No websites available yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
