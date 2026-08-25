import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { dashboardService } from '../services/dashboard'
import type { ProfileUser, SessionDevice } from '../types'
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
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Input'
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
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  XCircleIcon,
} from '../components/icons'

export function ProfilePage() {
  const { toast } = useToast()
  const [params, setParams] = useSearchParams()
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const tab = params.get('tab') ?? 'details'

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Email change state
  const [newEmail, setNewEmail] = useState('')
  const [changingEmail, setChangingEmail] = useState(false)
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false)

  // Sessions state
  const [sessions, setSessions] = useState<SessionDevice[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [revokingSession, setRevokingSession] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)
  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const profileData = await dashboardService.profile()
      setProfile(profileData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true)
    try {
      const sessionsData = await dashboardService.listSessions()
      setSessions(sessionsData)
      // Also update profile with sessions
      setProfile((current) => (current ? { ...current, sessions: sessionsData } : current))
    } finally {
      setSessionsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'sessions') {
      void loadSessions()
    }
  }, [tab, loadSessions])

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
        avatarUrl: profile.avatarUrl,
      })
      setProfile(updated)
      toast('Profile updated successfully', { variant: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      toast(message, { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      toast('Please fill in all fields', { variant: 'warning' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast('New passwords do not match', { variant: 'error' })
      return
    }
    if (newPassword.length < 8) {
      toast('New password must be at least 8 characters', { variant: 'error' })
      return
    }
    setChangingPassword(true)
    try {
      await dashboardService.changePassword({ currentPassword, newPassword })
      toast('Password changed successfully', { variant: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password'
      toast(message, { variant: 'error' })
    } finally {
      setChangingPassword(false)
    }
  }

  const openEmailChangeModal = () => {
    setNewEmail(profile?.email ?? '')
    setShowEmailChangeModal(true)
  }

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast('Please enter a valid email address', { variant: 'warning' })
      return
    }
    if (newEmail === profile?.email) {
      toast('This is already your current email', { variant: 'info' })
      return
    }
    setChangingEmail(true)
    try {
      const message = await dashboardService.changeEmail(newEmail)
      toast(message, { variant: 'success' })
      setShowEmailChangeModal(false)
      // Reload profile to get updated email
      void load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change email'
      toast(message, { variant: 'error' })
    } finally {
      setChangingEmail(false)
    }
  }

  const revoke = async (sessionId: string) => {
    setRevokingSession(sessionId)
    try {
      await dashboardService.revokeSession(sessionId)
      toast('Session revoked', { variant: 'info', description: 'The device will be signed out.' })
      await loadSessions()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to revoke session'
      toast(message, { variant: 'error' })
    } finally {
      setRevokingSession(null)
    }
  }

  const handleRevokeAllOther = async () => {
    setShowRevokeAllConfirm(false)
    setRevokingAll(true)
    try {
      // Find current session familyId - for now we'll pass empty string
      // The backend will revoke all sessions except the one making the request
      await dashboardService.revokeAllOtherSessions('')
      toast('All other sessions have been logged out', { variant: 'success' })
      await loadSessions()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to revoke sessions'
      toast(message, { variant: 'error' })
    } finally {
      setRevokingAll(false)
    }
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
              <p className="mt-0.5 text-sm font-semibold text-white">{profile.createdAt ? formatDateTime(profile.createdAt) : '—'}</p>
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
          { id: 'sessions', label: 'Sessions', icon: <DeviceIcon />, count: sessions.length },
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
              <Input id="pf-email" value={profile.email} readOnly />
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
                <div className="relative">
                  <Input
                    id="pf-cur"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </Field>
              <Field label="New password" htmlFor="pf-new">
                <div className="relative">
                  <Input
                    id="pf-new"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </Field>
              <Field label="Confirm new password" htmlFor="pf-confirm">
                <div className="relative">
                  <Input
                    id="pf-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </Field>
            </div>
            <div className="border-t border-line px-5 py-4">
              <Button
                icon={<KeyIcon />}
                loading={changingPassword}
                onClick={handleChangePassword}
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
            actions={
              sessions.length > 1 ? (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<LogOutIcon />}
                  loading={revokingAll}
                  onClick={() => setShowRevokeAllConfirm(true)}
                >
                  Log out of all other sessions
                </Button>
              ) : null
            }
          />
          {sessionsLoading ? (
            <div className="px-5 py-8 space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted">
              No active sessions found.
            </div>
          ) : (
            <ul className="divide-y divide-line px-2 pb-2">
              {sessions.map((session) => (
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
                      loading={revokingSession === session.id}
                      onClick={() => void revoke(session.id)}
                    >
                      Revoke
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          {/* Email Change Modal */}
          <Modal
            open={showEmailChangeModal}
            onClose={() => { setShowEmailChangeModal(false); setNewEmail(''); }}
            title="Change email address"
            description="Enter your new email address. A verification email will be sent."
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => { setShowEmailChangeModal(false); setNewEmail(''); }}>Cancel</Button>
                <Button
                  variant="primary"
                  icon={<CheckCircleIcon />}
                  loading={changingEmail}
                  onClick={handleChangeEmail}
                >
                  Send verification email
                </Button>
              </>
            }
          >
            <Field label="New email address" htmlFor="pf-new-email">
              <Input
                id="pf-new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
              />
            </Field>
          </Modal>

          {/* Revoke All Other Sessions Confirm Modal */}
          <Modal
            open={showRevokeAllConfirm}
            onClose={() => setShowRevokeAllConfirm(false)}
            title="Log out of all other sessions?"
            description="This will sign you out on all other devices. Your current session will remain active."
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => setShowRevokeAllConfirm(false)}>Cancel</Button>
                <Button
                  variant="danger"
                  icon={<XCircleIcon />}
                  loading={revokingAll}
                  onClick={handleRevokeAllOther}
                >
                  Log out all other sessions
                </Button>
              </>
            }
          >
            <p className="text-sm text-muted">Are you sure you want to revoke all other active sessions?</p>
          </Modal>
        </Card>
      )}
    </div>
  )
}
