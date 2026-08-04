import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  Users,
  Shield,
  FileText,
  Layers,
  Image,
  CalendarDays,
  Megaphone,
  HandCoins,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import {
  createOrganizationUser,
  deleteOrganizationUser,
  getAssignedAdmins,
  getOrganization,
  getOrganizationUsers,
} from '../services/organizationService'
import { getSiteStats } from '../services/dashboardService'
import type {
  AssignedAdmin,
  Organization,
  OrganizationMember,
  SiteStats,
} from '../types'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../utils/validation'
import '../styles/pages.css'

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? 'Something went wrong. Please try again.'
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }
  return <span className="field-error">{message}</span>
}

interface UserForm {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

const EMPTY_USER_FORM: UserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
}

function AddUserModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (form: UserForm) => Promise<void>
}) {
  const [form, setForm] = useState<UserForm>(EMPTY_USER_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function updateField(field: keyof UserForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Partial<Record<keyof UserForm, string>> = {}
    if (form.firstName.trim().length === 0) {
      nextErrors.firstName = 'First name is required.'
    }
    if (!isValidEmail(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((message) => message !== undefined)) {
      return
    }

    setIsSaving(true)
    setFormError('')
    try {
      await onSave(form)
    } catch (error) {
      setFormError(getErrorMessage(error))
      setIsSaving(false)
    }
  }

  return (
    <Modal title="Add Website User" onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit} noValidate>
        {formError && <div className="modal-form__error">{formError}</div>}

        <div className="settings-form__row">
          <div className="input-group">
            <label className="input-group__label" htmlFor="user-first-name">
              First Name
            </label>
            <input
              id="user-first-name"
              className={`input ${errors.firstName ? 'input--error' : ''}`}
              type="text"
              value={form.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
            />
            <FieldError message={errors.firstName} />
          </div>

          <div className="input-group">
            <label className="input-group__label" htmlFor="user-last-name">
              Last Name
            </label>
            <input
              id="user-last-name"
              className="input"
              type="text"
              value={form.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-group__label" htmlFor="user-email">
            Email
          </label>
          <input
            id="user-email"
            className={`input ${errors.email ? 'input--error' : ''}`}
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="input-group">
          <label className="input-group__label" htmlFor="user-password">
            Password
          </label>
          <input
            id="user-password"
            className={`input ${errors.password ? 'input--error' : ''}`}
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
          />
          <FieldError message={errors.password} />
        </div>

        <div className="input-group">
          <label className="input-group__label" htmlFor="user-phone">
            Phone
          </label>
          <input
            id="user-phone"
            className="input"
            type="text"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </div>

        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="spin" size={16} />
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Add User
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof Globe
}) {
  return (
    <div className="card stat-card">
      <div className="stat-card__top">
        <span className="stat-card__icon stat-card__icon--indigo">
          <Icon size={20} />
        </span>
      </div>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  )
}

function WebsiteDetail() {
  const { id } = useParams<{ id: string }>()
  const [org, setOrg] = useState<Organization | null>(null)
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [users, setUsers] = useState<OrganizationMember[]>([])
  const [admins, setAdmins] = useState<AssignedAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [pageError, setPageError] = useState('')
  const { user } = useAuth()

  const canManageUsers = user?.isMaster === true
  const canViewAdmins = user?.isMaster === true

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!id) return
      setIsLoading(true)
      setPageError('')
      try {
        const [orgData, statsData, usersData] = await Promise.all([
          getOrganization(id),
          getSiteStats(id),
          getOrganizationUsers(id, { page: 1, limit: 100 }),
        ])
        if (cancelled) return
        setOrg(orgData)
        setStats(statsData)
        setUsers(usersData.items)
        if (user?.isMaster) {
          const adminsData = await getAssignedAdmins(id)
          if (!cancelled) setAdmins(adminsData)
        }
      } catch (error) {
        if (!cancelled) setPageError(getErrorMessage(error))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id, user?.isMaster])

  async function handleAddUser(form: UserForm) {
    if (!id) return
    await createOrganizationUser(id, {
      email: form.email.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || null,
      phone: form.phone.trim() || null,
    })
    const usersData = await getOrganizationUsers(id, { page: 1, limit: 100 })
    setUsers(usersData.items)
    setIsAddUserOpen(false)
  }

  async function handleRemoveUser(userId: string) {
    if (!id) return
    const confirmed = window.confirm('Remove this user from the website?')
    if (!confirmed) return

    setPageError('')
    try {
      await deleteOrganizationUser(id, userId)
      setUsers((current) => current.filter((member) => member.user.id !== userId))
    } catch (error) {
      setPageError(getErrorMessage(error))
    }
  }

  const statRows = [
    { key: 'users' as const, label: 'Users', icon: Users },
    { key: 'projects' as const, label: 'Projects', icon: Layers },
    { key: 'pages' as const, label: 'Pages', icon: FileText },
    { key: 'media' as const, label: 'Media', icon: Image },
    { key: 'events' as const, label: 'Events', icon: CalendarDays },
    { key: 'campaigns' as const, label: 'Campaigns', icon: Megaphone },
    { key: 'donations' as const, label: 'Donations', icon: HandCoins },
  ]

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <Link to="/websites" className="back-link">
            <ArrowLeft size={15} />
            Back to Websites
          </Link>
          <h1 className="page__title">
            {org?.name ?? 'Website'}
            {org && (
              <span
                className={`status-badge ${
                  org.status === 'ACTIVE'
                    ? 'status-badge--active'
                    : 'status-badge--inactive'
                }`}
              >
                {org.status.toLowerCase()}
              </span>
            )}
          </h1>
          <p className="page__subtitle">
            {org?.slug}
            {org?.website && (
              <>
                {' — '}
                <a
                  href={org.website}
                  target="_blank"
                  rel="noreferrer"
                  className="website-url-link"
                >
                  {org.website}
                  <ExternalLink size={13} />
                </a>
              </>
            )}
          </p>
        </div>
        <Link to={`/websites/${id}/ucs`} className="btn btn--primary">
          <Globe size={16} />
          Site Sync (UCS)
        </Link>
      </header>

      {pageError && <div className="page-error">{pageError}</div>}

      {isLoading ? (
        <div className="card dashboard-panel" aria-busy="true">
          <div className="skeleton skeleton--bar" style={{ width: '40%' }} />
          <div className="skeleton skeleton--bar" style={{ width: '80%' }} />
          <div className="skeleton skeleton--bar" style={{ width: '60%' }} />
        </div>
      ) : (
        <>
          <section className="stats-grid" aria-label="Site statistics">
            {statRows.map((row) => (
              <StatCard
                key={row.key}
                label={row.label}
                value={stats?.counts[row.key] ?? 0}
                icon={row.icon}
              />
            ))}
          </section>

          <section className="card settings-section">
            <div className="settings-section__head">
              <div>
                <h2 className="settings-section__title">
                  <Users size={16} /> Website Users
                </h2>
                <p className="settings-section__hint">
                  Users who sign in to customize this website.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setIsAddUserOpen(true)}
              >
                <Plus size={16} />
                Add User
              </button>
            </div>

            {users.length === 0 ? (
              <div className="empty-state empty-state--compact">
                <Globe size={24} />
                <p className="empty-state__title">No website users yet</p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th className="table__right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((member) => (
                      <tr key={member.id}>
                        <td>
                          {[member.user.firstName, member.user.lastName]
                            .filter(Boolean)
                            .join(' ') || '—'}
                        </td>
                        <td>{member.user.email}</td>
                        <td>{member.role.name}</td>
                        <td className="table__right">
                          {canManageUsers && (
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              aria-label={`Remove ${member.user.email}`}
                              onClick={() => handleRemoveUser(member.user.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {canViewAdmins && (
            <section className="card settings-section">
              <div className="settings-section__head">
                <div>
                  <h2 className="settings-section__title">
                    <Shield size={16} /> Assigned Admins
                  </h2>
                  <p className="settings-section__hint">
                    Platform admins who can manage this website.
                  </p>
                </div>
              </div>

              {admins.length === 0 ? (
                <div className="empty-state empty-state--compact">
                  <Shield size={24} />
                  <p className="empty-state__title">No admins assigned</p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>
                            {[
                              assignment.user.firstName,
                              assignment.user.lastName,
                            ]
                              .filter(Boolean)
                              .join(' ') || '—'}
                          </td>
                          <td>{assignment.user.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {isAddUserOpen && (
        <AddUserModal
          onClose={() => setIsAddUserOpen(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  )
}

export default WebsiteDetail
