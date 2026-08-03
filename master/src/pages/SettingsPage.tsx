import { useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { BellIcon, ShieldIcon, UserIcon } from '../components/icons'
import { useToast } from '../context/ToastContext'

const cardClass = 'rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8'

function SectionTitle({
  icon,
  iconClass,
  title,
  description,
}: {
  icon: ReactNode
  iconClass: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </span>
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
          checked ? 'bg-brand' : 'bg-soft'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )
}

interface PasswordErrors {
  current?: string
  new?: string
  confirm?: string
}

export function SettingsPage() {
  const toast = useToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<PasswordErrors>({})

  const [notifications, setNotifications] = useState({
    email: true,
    newAdmins: true,
    security: false,
  })

  const handleUpdatePassword = () => {
    const nextErrors: PasswordErrors = {}
    if (currentPassword.length === 0) {
      nextErrors.current = 'Enter your current password.'
    }
    if (newPassword.length < 8) {
      nextErrors.new = 'Password must be at least 8 characters.'
    }
    if (confirmPassword !== newPassword) {
      nextErrors.confirm = 'Passwords do not match.'
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success({
      title: 'Password updated',
      description: 'Your password was changed successfully.',
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <header className="mb-10 animate-rise">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
          Overview
        </p>
        <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage your account and platform preferences.
        </p>
      </header>

      <div className="grid max-w-5xl gap-8">
        <section
          aria-labelledby="account-title"
          className={`${cardClass} animate-rise`}
          style={{ animationDelay: '40ms' }}
        >
          <SectionTitle
            icon={<UserIcon className="h-5 w-5" />}
            iconClass="bg-brand-soft text-brand"
            title="Account"
            description="Change your account password."
          />

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Input
              label="Current password"
              type="password"
              revealable
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              error={errors.current}
            />
            <Input
              label="New password"
              type="password"
              revealable
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={errors.new}
              hint="At least 8 characters."
            />
            <Input
              label="Confirm new password"
              type="password"
              revealable
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={errors.confirm}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleUpdatePassword}>Update password</Button>
          </div>
        </section>

        <section
          aria-labelledby="notifications-title"
          className={`${cardClass} animate-rise`}
          style={{ animationDelay: '90ms' }}
        >
          <SectionTitle
            icon={<BellIcon className="h-5 w-5" />}
            iconClass="bg-info/10 text-info"
            title="Notifications"
            description="Choose which updates you want to receive."
          />

          <div className="mt-4 divide-y divide-soft">
            <Toggle
              label="Email notifications"
              description="Receive account and platform updates by email."
              checked={notifications.email}
              onChange={(value) =>
                setNotifications((current) => ({ ...current, email: value }))
              }
            />
            <Toggle
              label="New admin alerts"
              description="Get notified when a new administrator is added."
              checked={notifications.newAdmins}
              onChange={(value) =>
                setNotifications((current) => ({
                  ...current,
                  newAdmins: value,
                }))
              }
            />
            <Toggle
              label="Security alerts"
              description="Alerts for sign-ins and sensitive account changes."
              checked={notifications.security}
              onChange={(value) =>
                setNotifications((current) => ({
                  ...current,
                  security: value,
                }))
              }
            />
          </div>

          <p className="mt-5 flex items-center gap-1.5 text-xs text-muted">
            <ShieldIcon className="h-3.5 w-3.5" />
            Preferences are applied instantly in this workspace.
          </p>
        </section>
      </div>
    </div>
  )
}
