import { Fragment, useCallback, useEffect, useState } from 'react'
import type { Role } from '../types/role'
import { roleService, ROLES_UPDATED_EVENT } from '../services/roleService'
import { CreateRoleModal } from '../components/role/CreateRoleModal'
import { Button } from '../components/ui/Button'
import {
  ChevronDownIcon,
  GlobeIcon,
  PlusIcon,
  ShieldIcon,
} from '../components/icons'
import { MANAGED_WEBSITES } from '../data/websites'

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

type PermissionKey = 'view' | 'edit' | 'delete'
type WebsitePermissions = Record<string, PermissionKey[]>

const PERMISSIONS: PermissionKey[] = ['view', 'edit', 'delete']
const PERMISSION_STORAGE_KEY = 'master-crm.website-permissions.v1'
const WEBSITE_USER_ROLE = 'Website User'

export function RolePage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<WebsitePermissions>(() => {
    try {
      const raw = localStorage.getItem(PERMISSION_STORAGE_KEY)
      if (!raw) return {}
      const parsed: unknown = JSON.parse(raw)
      return parsed && typeof parsed === 'object'
        ? (parsed as WebsitePermissions)
        : {}
    } catch {
      return {}
    }
  })

  const togglePermission = (websiteId: string, permission: PermissionKey) => {
    setPermissions((current) => {
      const selected = current[websiteId] ?? []
      const next = selected.includes(permission)
        ? selected.filter((item) => item !== permission)
        : [...selected, permission]
      const updated = { ...current, [websiteId]: next }
      localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const loadRoles = useCallback(async () => {
    setLoading(true)
    try {
      const result = await roleService.list()
      setRoles(result)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRoles()
    window.addEventListener(ROLES_UPDATED_EVENT, loadRoles)
    return () => window.removeEventListener(ROLES_UPDATED_EVENT, loadRoles)
  }, [loadRoles])

  const handleRoleCreated = (role: Role) => {
    setRoles((current) => [...current, role])
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4 animate-rise">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
            Access control
          </p>
          <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink">
            Role & Permission
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Roles available on the platform.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add role
        </Button>
      </header>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-soft" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <ShieldIcon className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold text-ink">No roles yet</p>
          <p className="mt-1 text-sm text-muted">
            Click “Add role” to create your first role.
          </p>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(true)}
            className="mt-5"
          >
            <PlusIcon className="h-4 w-4" />
            Add role
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="min-w-[560px] w-full text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="w-full border-b-2 border-line px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft">
              {roles.map((role) => {
                const isWebsiteUser = role.name === WEBSITE_USER_ROLE
                const expanded = expandedRole === role.id
                return (
                  <Fragment key={role.id}>
                    <tr
                      onClick={
                        isWebsiteUser
                          ? () => setExpandedRole(expanded ? null : role.id)
                          : undefined
                      }
                      className={`transition-colors duration-150 hover:bg-row-hover ${
                        isWebsiteUser ? 'cursor-pointer' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                            <ShieldIcon className="h-4 w-4" />
                          </span>
                          <span className="font-medium text-ink">
                            {role.name}
                          </span>
                        </div>
                      </td>
                      <td className="w-full px-5 py-4 text-center text-muted">
                        {role.description}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">
                        <span className="inline-flex items-center gap-2">
                          {formatDate(role.createdAt)}
                          {isWebsiteUser && (
                            <ChevronDownIcon
                              className={`h-4 w-4 text-faint transition-transform duration-200 ${
                                expanded ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </span>
                      </td>
                    </tr>
                    {isWebsiteUser && expanded && (
                      <tr>
                        <td colSpan={3} className="bg-soft/60 px-5 pb-5">
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-ink">
                              Website access
                            </p>
                            <p className="text-xs text-muted">
                              Assign view, edit and delete permissions per
                              website.
                            </p>
                          </div>
                          <div className="divide-y divide-soft overflow-hidden rounded-xl border border-line bg-white">
                            {MANAGED_WEBSITES.map((website) => {
                              const selected = permissions[website.id] ?? []
                              return (
                                <div
                                  key={website.id}
                                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                                      <GlobeIcon className="h-4 w-4" />
                                    </span>
                                    <div>
                                      <p className="text-sm font-medium text-ink">
                                        {website.name}
                                      </p>
                                      <p className="text-xs text-muted">
                                        {website.url}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    {PERMISSIONS.map((permission) => {
                                      const checked = selected.includes(
                                        permission,
                                      )
                                      return (
                                        <label
                                          key={permission}
                                          className="flex items-center gap-2"
                                        >
                                          <span className="text-xs font-semibold capitalize text-muted">
                                            {permission}
                                          </span>
                                          <button
                                            type="button"
                                            role="switch"
                                            aria-checked={checked}
                                            aria-label={permission}
                                            onClick={() =>
                                              togglePermission(
                                                website.id,
                                                permission,
                                              )
                                            }
                                            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                                              checked ? 'bg-brand' : 'bg-soft'
                                            }`}
                                          >
                                            <span
                                              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
                                                checked ? 'translate-x-4' : ''
                                              }`}
                                            />
                                          </button>
                                        </label>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateRoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleRoleCreated}
      />
    </div>
  )
}
