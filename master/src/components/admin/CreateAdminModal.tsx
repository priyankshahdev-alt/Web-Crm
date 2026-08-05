import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import type { AdminUser } from '../../types/admin'
import type { ManagedWebsite } from '../../types/website'
import { adminService } from '../../services/adminService'
import { generatePassword } from '../../utils/generators'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface CreateAdminModalProps {
  open: boolean
  websites: ManagedWebsite[]
  onClose: () => void
  onCreated: (admin: AdminUser) => void
}

interface FormState {
  email: string
  password: string
  managedWebsites: string[]
}

interface FormErrors {
  email?: string
  password?: string
}

const INITIAL_FORM: FormState = {
  email: '',
  password: '',
  managedWebsites: [],
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CreateAdminModal({
  open,
  websites,
  onClose,
  onCreated,
}: CreateAdminModalProps) {
  const toast = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const resetAndGenerate = useCallback(() => {
    setForm({
      email: '',
      password: generatePassword(),
      managedWebsites: [],
    })
    setErrors({})
  }, [])

  useEffect(() => {
    if (open) resetAndGenerate()
  }, [open, resetAndGenerate])

  const validate = (values: FormState): FormErrors => {
    const nextErrors: FormErrors = {}
    const email = values.email.trim()
    const password = values.password

    if (!email) {
      nextErrors.email = 'Email is required'
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = 'Enter a valid email address'
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
    if (field === 'email' || field === 'password') {
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
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setTimeout(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>(
          'input[aria-invalid="true"]',
        )
        firstInvalid?.focus()
      }, 0)
      return
    }

    setSubmitting(true)
    try {
      const admin = await adminService.create({
        email: form.email.trim(),
        password: form.password,
        managedWebsites: form.managedWebsites,
      })
      toast.success({
        title: 'Admin created',
        description: `Admin user "${admin.email}" is now active.`,
      })
      onCreated(admin)
      onClose()
    } catch (err) {
      const { message, field } = adminService.errorMessage(err)
      toast.error({ title: 'Could not create admin', description: message })
      if (field === 'email') setErrors({ email: message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Admin"
      description="A generated password is filled in for you and can be edited."
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
            form="create-admin-form"
            loading={submitting}
          >
            Create Admin
          </Button>
        </>
      }
    >
      <form id="create-admin-form" ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            error={errors.email}
            hint="Used to sign in to the admin panel."
            autoComplete="off"
            spellCheck={false}
          />

          <Input
            label="Password"
            type="password"
            revealable
            value={form.password}
            onChange={(event) => handleFieldChange('password', event.target.value)}
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-ink">
                Managed websites
              </label>
              <span className="text-xs text-muted">
                {form.managedWebsites.length} selected
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {websites.map((site) => {
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
