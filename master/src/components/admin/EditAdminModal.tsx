import { useEffect, useState, type FormEvent } from 'react'
import type { AdminRole, AdminStatus, AdminUser } from '../../types/admin'
import { MANAGED_WEBSITES } from '../../data/websites'
import { adminService } from '../../services/adminService'
import { generatePassword } from '../../utils/generators'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface EditAdminModalProps {
  open: boolean
  admin: AdminUser | null
  onClose: () => void
  onUpdated: (admin: AdminUser) => void
}

interface FormState {
  username: string
  password: string
  role: AdminRole
  status: AdminStatus
  managedWebsites: string[]
}

interface FormErrors {
  username?: string
  password?: string
}

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/

const allSiteIds = (): string[] => MANAGED_WEBSITES.map((site) => site.id)

export function EditAdminModal({
  open,
  admin,
  onClose,
  onUpdated,
}: EditAdminModalProps) {
  const toast = useToast()
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    role: 'site',
    status: 'active',
    managedWebsites: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && admin) {
      setForm({
        username: admin.username,
        password: '',
        role: admin.role,
        status: admin.status,
        managedWebsites: admin.managedWebsites ?? allSiteIds(),
      })
      setErrors({})
    }
  }, [open, admin])

  const validate = (values: FormState): FormErrors => {
    const nextErrors: FormErrors = {}
    const username = values.username.trim()
    const password = values.password

    if (!username) {
      nextErrors.username = 'Username is required'
    } else if (username.length < 3 || username.length > 32) {
      nextErrors.username = 'Username must be between 3 and 32 characters'
    } else if (!USERNAME_PATTERN.test(username)) {
      nextErrors.username = 'Only letters, numbers, dots, underscores and hyphens'
    }

    if (password) {
      if (password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters'
      } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        nextErrors.password =
          'Password must contain at least one letter and one number'
      }
    }

    return nextErrors
  }

  const handleFieldChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'username' || field === 'password') {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  const toggleSite = (siteId: string) => {
    setForm((current) => ({
      ...current,
      managedWebsites: current.managedWebsites.includes(siteId)
        ? current.managedWebsites.filter((id) => id !== siteId)
        : [...current.managedWebsites, siteId],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!admin) return

    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      toast.error({ title: 'Fix the errors below' })
      return
    }

    setSubmitting(true)
    try {
      const updated = await adminService.update(admin.id, {
        username: form.username.trim(),
        password: form.password || undefined,
        role: form.role,
        status: form.status,
        managedWebsites: form.managedWebsites,
      })
      toast.success({
        title: 'Admin updated successfully',
        description: `Admin user "${updated.username}" has been updated.`,
      })
      onUpdated(updated)
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        toast.error({ title: 'Could not update admin', description: err.message })
        if (err.name === 'DuplicateUsernameError') {
          setErrors({ username: err.message })
        }
      } else {
        toast.error({
          title: 'Could not update admin',
          description: 'Something went wrong.',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Admin"
      description="Update this admin's details and access."
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
            form="edit-admin-form"
            loading={submitting}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-admin-form" onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <Input
            label="Username"
            value={form.username}
            onChange={(event) =>
              handleFieldChange('username', event.target.value)
            }
            error={errors.username}
            hint="Min 3 characters. Letters, numbers, dots, underscores or hyphens."
            autoComplete="off"
            spellCheck={false}
          />

          <Input
            label="Password"
            type="password"
            revealable
            value={form.password}
            placeholder="Leave blank to keep current password"
            onChange={(event) =>
              handleFieldChange('password', event.target.value)
            }
            error={errors.password}
            hint="Min 8 characters including at least one letter and one number. Leave blank to keep the current password."
            autoComplete="new-password"
            trailingAction={
              <button
                type="button"
                onClick={() => handleFieldChange('password', generatePassword())}
                className="inline-flex h-full items-center gap-1.5 rounded-r-xl border border-l-0 border-line bg-white px-3 text-xs font-semibold text-brand transition hover:bg-brand-soft"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                    clipRule="evenodd"
                  />
                </svg>
                Generate
              </button>
            }
          />

          <div>
            <label
              htmlFor="edit-admin-role"
              className="block text-sm font-medium text-ink"
            >
              Access scope
            </label>
            <div className="mt-1.5">
              <select
                id="edit-admin-role"
                value={form.role}
                onChange={(event) =>
                  handleFieldChange('role', event.target.value as AdminRole)
                }
                className="block w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="site">Site Admin</option>
                <option value="master">Master Admin</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-admin-status"
                className="block text-sm font-medium text-ink"
              >
                Status
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted">
                  {form.status === 'active' ? 'Active' : 'Disabled'}
                </span>
                <button
                  type="button"
                  role="switch"
                  id="edit-admin-status"
                  aria-checked={form.status === 'active'}
                  onClick={() =>
                    handleFieldChange(
                      'status',
                      form.status === 'active' ? 'disabled' : 'active',
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    form.status === 'active' ? 'bg-brand' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150 ${
                      form.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-ink">
                Managed websites
              </label>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleFieldChange('managedWebsites', allSiteIds())}
                  className="text-brand transition hover:text-brand/80"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('managedWebsites', [])}
                  className="text-muted transition hover:text-ink"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {MANAGED_WEBSITES.map((site) => {
                const checked = form.managedWebsites.includes(site.id)
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
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
