import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import type { AdminRole, AdminUser } from '../../types/admin'
import { adminService } from '../../services/adminService'
import { generatePassword, generateUsername } from '../../utils/generators'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface CreateAdminModalProps {
  open: boolean
  onClose: () => void
  onCreated: (admin: AdminUser) => void
}

interface FormState {
  username: string
  password: string
  role: AdminRole
}

interface FormErrors {
  username?: string
  password?: string
}

const INITIAL_FORM: FormState = {
  username: '',
  password: '',
  role: 'site',
}

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/

export function CreateAdminModal({
  open,
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
      username: generateUsername(),
      password: generatePassword(),
      role: 'site',
    })
    setErrors({})
  }, [])

  useEffect(() => {
    if (open) resetAndGenerate()
  }, [open, resetAndGenerate])

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
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      })
      toast.success({
        title: 'Admin created',
        description: `Admin user "${admin.username}" is now active.`,
      })
      onCreated(admin)
      onClose()
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
    <Modal
      open={open}
      onClose={onClose}
      title="Create Admin"
      description="Auto-generated credentials are filled in for you and can be edited."
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
            label="Username"
            value={form.username}
            onChange={(event) => handleFieldChange('username', event.target.value)}
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
            <label
              htmlFor="admin-role"
              className="block text-sm font-medium text-ink"
            >
              Access scope
            </label>
            <div className="mt-1.5">
              <select
                id="admin-role"
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
        </div>
      </form>
    </Modal>
  )
}
