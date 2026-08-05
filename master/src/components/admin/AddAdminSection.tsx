import { useState, type FormEvent } from 'react'
import type { AdminUser } from '../../types/admin'
import type { ManagedWebsite } from '../../types/website'
import { adminService } from '../../services/adminService'
import { generatePassword } from '../../utils/generators'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface AddAdminSectionProps {
  websites: ManagedWebsite[]
  onCreated: (admin: AdminUser) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AddAdminSection({
  websites,
  onCreated,
}: AddAdminSectionProps) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [managedWebsites, setManagedWebsites] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>(undefined)

  const toggleSite = (siteId: string) => {
    setManagedWebsites((current) =>
      current.includes(siteId)
        ? current.filter((id) => id !== siteId)
        : [...current, siteId],
    )
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
        password: generatePassword(),
        managedWebsites,
      })
      toast.success({
        title: 'Admin created',
        description: `Admin user "${admin.email}" is now active.`,
      })
      onCreated(admin)
      setEmail('')
      setManagedWebsites([])
    } catch (err) {
      const { message, field } = adminService.errorMessage(err)
      toast.error({ title: 'Could not create admin', description: message })
      if (field === 'email') setEmailError(message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-4 px-5 py-4"
        noValidate
      >
        <div className="min-w-[240px] flex-1">
          <Input
            label="Quick-add admin"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError(undefined)
            }}
            error={emailError}
            placeholder="admin@example.com"
            hint="A generated password is sent on creation — copy the email to retrieve it."
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {websites.length > 0 ? (
          <div className="w-full sm:w-auto">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Managed websites
            </span>
            <div className="flex flex-wrap gap-1.5">
              {websites.map((site) => {
                const checked = managedWebsites.includes(site.id)
                return (
                  <button
                    type="button"
                    key={site.id}
                    onClick={() => toggleSite(site.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      checked
                        ? 'border-brand/30 bg-brand-soft text-brand'
                        : 'border-line text-muted hover:bg-soft'
                    }`}
                  >
                    {site.name}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        <Button type="submit" loading={creating} className="shrink-0">
          Add Admin
        </Button>
      </form>
    </div>
  )
}
