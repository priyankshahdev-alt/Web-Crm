import { useCallback, useState, type FormEvent } from 'react'
import type { AdminRole, AdminStatus, AdminUser } from '../../types/admin'
import { adminService } from '../../services/adminService'
import { MANAGED_WEBSITES } from '../../data/websites'
import { generatePassword, generateUsername } from '../../utils/generators'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { GlobeIcon, PlusIcon, RefreshIcon } from '../icons'

interface AddAdminSectionProps {
  onCreated: (admin: AdminUser) => void
}

interface FormState {
  username: string
  password: string
  role: AdminRole
  status: AdminStatus
  managedWebsiteIds: string[]
}

interface FormErrors {
  username?: string
  password?: string
}

const ALL_SITE_IDS = MANAGED_WEBSITES.map((site) => site.id)

const INITIAL_FORM: FormState = {
  username: '',
  password: '',
  role: 'site',
  status: 'active',
  managedWebsiteIds: ALL_SITE_IDS,
}

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/

const selectClass =
  'block w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'

export function AddAdminSection({ onCreated }: AddAdminSectionProps) {
  const toast = useToast()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const allSitesSelected =
    form.managedWebsiteIds.length === MANAGED_WEBSITES.length

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

    if (!password) {
      nextErrors.password = 'Password is required'
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
    } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      nextErrors.password = 'Password must contain at least one letter and one number'
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
    setForm((current) => {
      const selected = current.managedWebsiteIds.includes(siteId)
        ? current.managedWebsiteIds.filter((id) => id !== siteId)
        : [...current.managedWebsiteIds, siteId]
      return { ...current, managedWebsiteIds: selected }
    })
  }

  const toggleAllSites = () => {
    setForm((current) => ({
      ...current,
      managedWebsiteIds: allSitesSelected ? [] : ALL_SITE_IDS,
    }))
  }

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM)
    setErrors({})
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      toast.error({ title: 'Fix the errors below' })
      return
    }

    setSubmitting(true)
    try {
      const admin = await adminService.create({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
        status: form.status,
        managedWebsites: form.managedWebsiteIds,
      })
      toast.success({
        title: 'Admin created',
        description: `Admin user "${admin.username}" is now active.`,
      })
      onCreated(admin)
      resetForm()
    } catch (err) {
      if (err instanceof Error) {
        toast.error({ title: 'Could not create admin', description: err.message })
        if (err.name === 'DuplicateUsernameError') {
          setErrors({ username: err.message })
        }
      } else {
        toast.error({ title: 'Could not create admin', description: 'Something went wrong.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      aria-labelledby="add-admin-title"
      className="animate-rise rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8"
      style={{ animationDelay: '40ms' }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <PlusIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2
              id="add-admin-title"
              className="text-lg font-semibold text-ink"
            >
              Add admin user
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Create a full admin account with role, status and website access.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetForm}
          disabled={submitting}
        >
          <RefreshIcon className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid gap-5 md:grid-cols-2">
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
            trailingAction={
              <button
                type="button"
                onClick={() => {
                  handleFieldChange('username', generateUsername())
                }}
                className="inline-flex h-full items-center gap-1.5 rounded-r-xl border border-l-0 border-line bg-white px-3 text-xs font-semibold text-brand transition hover:bg-brand-soft"
              >
                Generate
              </button>
            }
          />

          <Input
            label="Password"
            type="password"
            revealable
            value={form.password}
            onChange={(event) =>
              handleFieldChange('password', event.target.value)
            }
            error={errors.password}
            hint="Min 8 characters including at least one letter and one number."
            autoComplete="new-password"
            trailingAction={
              <button
                type="button"
                onClick={() => {
                  handleFieldChange('password', generatePassword())
                }}
                className="inline-flex h-full items-center gap-1.5 rounded-r-xl border border-l-0 border-line bg-white px-3 text-xs font-semibold text-brand transition hover:bg-brand-soft"
              >
                Generate
              </button>
            }
          />

          <div>
            <label
              htmlFor="add-admin-role"
              className="block text-sm font-medium text-ink"
            >
              Access scope
            </label>
            <select
              id="add-admin-role"
              value={form.role}
              onChange={(event) =>
                handleFieldChange('role', event.target.value as AdminRole)
              }
              className={`${selectClass} mt-1.5`}
            >
              <option value="site">Site Admin</option>
              <option value="master">Master Admin</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="add-admin-status"
              className="block text-sm font-medium text-ink"
            >
              Status
            </label>
            <select
              id="add-admin-status"
              value={form.status}
              onChange={(event) =>
                handleFieldChange('status', event.target.value as AdminStatus)
              }
              className={`${selectClass} mt-1.5`}
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <GlobeIcon className="h-4 w-4 text-muted" />
                Managed websites
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAllSites}
                  className="text-xs font-semibold text-brand transition hover:text-brand/80"
                >
                  {allSitesSelected ? 'Clear all' : 'Select all'}
                </button>
                <span className="text-xs text-muted">
                  {form.managedWebsiteIds.length} of {MANAGED_WEBSITES.length}{' '}
                  selected
                </span>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {MANAGED_WEBSITES.map((site) => {
                const selected = form.managedWebsiteIds.includes(site.id)
                return (
                  <label
                    key={site.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors duration-150 ${
                      selected
                        ? 'border-brand bg-brand-soft/60'
                        : 'border-line bg-white hover:border-brand/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSite(site.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-ink">
                        {site.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {site.url}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-line pt-5">
          <Button type="submit" loading={submitting}>
            <PlusIcon className="h-4 w-4" />
            Create admin user
          </Button>
        </div>
      </form>
    </section>
  )
}
