import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { dashboardService } from '../services/dashboard'
import type { ProfileUser } from '../types'
import { formatDateTime } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Tabs } from '../components/ui/Tabs'
import { Avatar } from '../components/ui/Avatar'
import { Skeleton } from '../components/ui/Skeleton'
import { Badge } from '../components/ui/Badge'
import {
  UserIcon,
  LockIcon,
  KeyIcon,
  DeviceIcon,
  ShieldIcon,
  MailIcon,
  PhoneIcon,
  SaveIcon,
  MonitorIcon,
  LogOutIcon,
} from '../components/icons'

export function ProfilePage() {
  const { toast } = useToast()
  const [params, setParams] = useSearchParams()
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const tab = params.get('tab') ?? 'details'

  const load = useCallback(async () => {
    setLoading(true)
    setProfile(await dashboardService.profile())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setTab = (next: string) => {
    if (next === 'details') {
      setParams({})
    } else {
      setParams({ tab: next })
    }
  }

  const update = (patch: Partial<ProfileUser>) =>
    setProfile((current) => (current ? { ...current, ...patch } : current))

  const save = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const updated = await dashboardService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        twoFactorEnabled: profile.twoFactorEnabled,
      })
      setProfile(updated)
      toast('Profile updated', { variant: 'success' })
    } finally {
      setSaving(false)
    }
  }

  const revoke = async (sessionId: string) => {
    const updated = await dashboardService.revokeSession(sessionId)
    setProfile(updated)
    toast('Session revoked', { variant: 'info', description: 'The device will be signed out.' })
  }

  if (loading || !profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="System" title="My Profile" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="mt-4 h-64 rounded-2xl" />
      </div>
    )
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="System" title="My Profile" description="Manage your personal details, security and active sessions." />

      <Card className="mb-5 overflow-hidden">
        <div className="flex flex-col gap-5 bg-gradient-to-r from-brand to-brand-strong px-6 py-6 sm:flex-row sm:items-center">
          <Avatar name={fullName || profile.email} src={profile.avatarUrl} size="xl" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white">{fullName || 'User'}</h2>
            <p className="mt-0.5 text-sm text-brand-soft">{profile.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-white">
              {profile.roleName}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:ml-auto sm:justify-end">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-soft">Member since</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{formatDateTime(profile.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-soft">Last login</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {profile.lastLoginAt ? formatDateTime(profile.lastLoginAt) : '—'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs
        className="mb-5"
        tabs={[
          { id: 'details', label: 'Personal details', icon: <UserIcon /> },
          { id: 'security', label: 'Security', icon: <LockIcon /> },
          { id: 'sessions', label: 'Sessions', icon: <DeviceIcon />, count: profile.sessions.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'details' ? (
        <Card>
          <CardHeader
            title="Personal details"
            description="This information appears on your profile and in activity logs."
            actions={
              <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
                Save changes
              </Button>
            }
          />
          <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
            <Field label="First name" htmlFor="pf-first">
              <Input id="pf-first" value={profile.firstName} onChange={(event) => update({ firstName: event.target.value })} />
            </Field>
            <Field label="Last name" htmlFor="pf-last">
              <Input id="pf-last" value={profile.lastName} onChange={(event) => update({ lastName: event.target.value })} />
            </Field>
            <Field label="Email address" htmlFor="pf-email" hint="Changing email requires verification">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"><MailIcon className="h-4 w-4" /></span>
                <Input id="pf-email" className="pl-9" value={profile.email} readOnly />
              </div>
            </Field>
            <Field label="Phone number" htmlFor="pf-phone">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"><PhoneIcon className="h-4 w-4" /></span>
                <Input id="pf-phone" className="pl-9" value={profile.phone ?? ''} placeholder="+91 00000 00000" onChange={(event) => update({ phone: event.target.value })} />
              </div>
            </Field>
            <Field label="Role" htmlFor="pf-role">
              <Input id="pf-role" value={profile.roleName} readOnly />
            </Field>
          </div>
        </Card>
      ) : tab === 'security' ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Change password" description="Use a strong password you don't use elsewhere" />
            <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
              <Field label="Current password" htmlFor="pf-cur" className="sm:col-span-2">
                <Input id="pf-cur" type="password" placeholder="••••••••" />
              </Field>
              <Field label="New password" htmlFor="pf-new">
                <Input id="pf-new" type="password" placeholder="Minimum 8 characters" />
              </Field>
              <Field label="Confirm new password" htmlFor="pf-confirm">
                <Input id="pf-confirm" type="password" placeholder="Repeat new password" />
              </Field>
            </div>
            <div className="border-t border-line px-5 py-4">
              <Button
                icon={<KeyIcon />}
                onClick={() => toast('Password updated', { variant: 'success' })}
              >
                Update password
              </Button>
            </div>
          </Card>
          <Card>
            <CardHeader title="Two-factor authentication" description="Protect your account with a second step" />
            <div className="flex items-center justify-between gap-4 px-5 pb-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <ShieldIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Authenticator app</p>
                  <p className="mt-0.5 text-xs text-muted">Required when signing in from a new device.</p>
                </div>
              </div>
              <Toggle
                checked={profile.twoFactorEnabled}
                onChange={(twoFactorEnabled) => {
                  update({ twoFactorEnabled })
                  toast(twoFactorEnabled ? 'Two-factor enabled' : 'Two-factor disabled', {
                    variant: 'info',
                  })
                }}
              />
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader
            title="Active sessions"
            description="Devices currently signed in to your account. Revoke any session you don't recognize."
          />
          <ul className="divide-y divide-line px-2 pb-2">
            {profile.sessions.map((session) => (
              <li key={session.id} className="flex flex-wrap items-center gap-4 px-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-muted">
                  <MonitorIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{session.device}</p>
                    <span className="text-xs text-faint">· {session.browser}</span>
                    {session.current ? <Badge variant="brand" dot pulse>This device</Badge> : null}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span>{session.location}</span>
                    <span>{session.ip}</span>
                    <span className="text-faint">Active {formatDateTime(session.lastActive)}</span>
                  </p>
                </div>
                {!session.current ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<LogOutIcon />}
                    onClick={() => void revoke(session.id)}
                  >
                    Revoke
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
