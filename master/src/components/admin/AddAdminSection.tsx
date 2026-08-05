import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { AdminStatus, AdminUser } from '../../types/admin'
import type { ManagedWebsite } from '../../types/website'
import { adminService } from '../../services/adminService'
import { generatePassword, generateUsername } from '../../utils/generators'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import {
  CheckIcon,
  ChevronDownIcon,
  GlobeIcon,
  PlusIcon,
  RefreshIcon,
} from '../icons'
import {
  CredentialFields,
  type CredentialFieldKey,
} from './CredentialFields'

interface AddAdminSectionProps {
  websites: ManagedWebsite[]
  onCreated: (admin: AdminUser) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const COPY_FEEDBACK_MS = 1500

export function AddAdminSection({
  websites,
  onCreated,
}: AddAdminSectionProps) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(generatePassword)
  const [status, setStatus] = useState<AdminStatus>('active')
  const [managedWebsites, setManagedWebsites] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [created, setCreated] = useState<{
    email: string
    password: string
  } | null>(null)
  const [copied, setCopied] = useState<CredentialFieldKey | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )

  const copyCredential = async (field: CredentialFieldKey) => {
    if (!created) return
    const value = field === 'username' ? created.email : created.password
    try {
      await navigator.clipboard.writeText(value)
      setCopied(field)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(null), COPY_FEEDBACK_MS)
      toast.success({
        title: field === 'username' ? 'Username copied' : 'Password copied',
        description: `${
          field === 'username' ? 'Username' : 'Password'
        } copied to clipboard.`,
      })
    } catch {
      toast.error({ title: 'Could not copy' })
    }
  }

  const toggleSite = (siteId: string) => {
    setManagedWebsites((current) =>
      current.includes(siteId)
        ? current.filter((id) => id !== siteId)
        : [...current, siteId],
    )
  }

  const handleGenerateUsername = () => {
    setEmail(`${generateUsername()}@example.com`)
    setEmailError(undefined)
  }

  const handleReset = () => {
    setEmail('')
    setPassword(generatePassword())
    setStatus('active')
    setManagedWebsites([])
    setEmailError(undefined)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError('Email is required')
      return
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError('Enter a valid email address')
      return
    }

    setCreating(true)
    try {
      const admin = await adminService.create({
        email: trimmed,
        password,
        managedWebsites,
      })
      toast.success({
        title: 'Admin created',
        description: `Admin user "${admin.email}" is now active.`,
      })
      onCreated({ ...admin, status })
      setCreated({ email: trimmed, password })
    } catch (err) {
      const { message, field } = adminService.errorMessage(err)
      toast.error({ title: 'Could not create admin', description: message })
      if (field === 'email') setEmailError(message)
    } finally {
      setCreating(false)
    }
  }

  const handleAddAnother = () => {
    setCreated(null)
    setCopied(null)
    setEmail('')
    setPassword(generatePassword())
    setStatus('active')
    setManagedWebsites([])
    setEmailError(undefined)
  }

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      {created ? (
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Admin created</p>
                <p className="mt-0.5 text-xs text-muted">
                  Save these credentials now — the password won't be shown
                  again.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddAnother}
            >
              Add another
            </Button>
          </div>
          <div className="mt-4">
            <CredentialFields
              username={created.email}
              password={created.password}
              copied={copied}
              onCopy={copyCredential}
            />
          </div>
        </div>
      ) : (
        <div>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <PlusIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  Add admin user
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Create a new admin to manage websites on the platform.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              Reset
            </Button>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Username"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setEmailError(undefined)
                  }}
                  error={emailError}
                  placeholder="admin@example.com"
                  hint="The login email — it also becomes the username."
                  autoComplete="off"
                  spellCheck={false}
                  trailingAction={
                    <button
                      type="button"
                      onClick={handleGenerateUsername}
                      className="inline-flex h-full items-center gap-1.5 rounded-r-xl border border-l-0 border-line bg-white px-3 text-xs font-semibold text-violet-600 transition hover:bg-violet-50"
                    >
                      <RefreshIcon className="h-3.5 w-3.5" />
                      Generate
                    </button>
                  }
                />

                <Input
                  label="Password"
                  type="password"
                  revealable
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  hint="Auto-generated — at least 14 characters with upper and lowercase, numbers and symbols."
                  autoComplete="new-password"
                  trailingAction={
                    <button
                      type="button"
                      onClick={() => setPassword(generatePassword())}
                      className="inline-flex h-full items-center gap-1.5 rounded-r-xl border border-l-0 border-line bg-white px-3 text-xs font-semibold text-violet-600 transition hover:bg-violet-50"
                    >
                      <RefreshIcon className="h-3.5 w-3.5" />
                      Generate
                    </button>
                  }
                />

                <div>
                  <label
                    htmlFor="admin-access-scope"
                    className="block text-sm font-medium text-ink"
                  >
                    Access scope
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="admin-access-scope"
                      aria-label="Access scope"
                      defaultValue="Site Admin"
                      className="block w-full appearance-none rounded-xl border border-line bg-white px-3 py-2 pr-9 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="Site Admin">Site Admin</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-status"
                    className="block text-sm font-medium text-ink"
                  >
                    Status
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="admin-status"
                      aria-label="Status"
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as AdminStatus)
                      }
                      className="block w-full appearance-none rounded-xl border border-line bg-white px-3 py-2 pr-9 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    <GlobeIcon className="h-4 w-4 text-muted" />
                    Managed websites
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">
                      {managedWebsites.length} of {websites.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setManagedWebsites([])}
                      className="text-xs font-semibold text-violet-600 transition hover:text-violet-700"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                {websites.length > 0 ? (
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {websites.map((site) => {
                      const checked = managedWebsites.includes(site.id)
                      return (
                        <button
                          type="button"
                          key={site.id}
                          onClick={() => toggleSite(site.id)}
                          className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                            checked
                              ? 'border-violet-300 bg-violet-50'
                              : 'border-line hover:bg-soft'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                              checked
                                ? 'border-violet-600 bg-violet-600 text-white'
                                : 'border-line bg-white text-transparent'
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-ink">
                              {site.name}
                            </span>
                            <span className="block truncate text-xs text-faint">
                              {site.url}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-faint">
                    No websites available yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-line px-6 py-4">
              <Button
                type="submit"
                variant="violet"
                loading={creating}
                className="rounded-lg! bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600"
              >
                Create admin user
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
