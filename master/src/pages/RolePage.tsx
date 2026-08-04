import { Fragment, useCallback, useEffect, useState } from 'react'
import type { Role } from '../types/role'
import { roleService, ROLES_UPDATED_EVENT } from '../services/roleService'
import { CreateRoleModal } from '../components/role/CreateRoleModal'
import { Button } from '../components/ui/Button'
import { Pill } from '../components/ui/Pill'
import { PlusIcon, ShieldIcon } from '../components/icons'

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export function RolePage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

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
                  className="w-full border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="border-b-2 border-line px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
                >
                  Members
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
              {roles.map((role) => (
                <Fragment key={role.id}>
                  <tr className="transition-colors duration-150 hover:bg-row-hover">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                          <ShieldIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="font-medium text-ink">
                            {role.name}
                          </span>
                          {role.isSystem && (
                            <Pill variant="neutral" className="ml-2">
                              System
                            </Pill>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="w-full px-5 py-4 text-muted">
                      {role.description || role.key}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted">
                      {role.memberCount}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted">
                      {formatDate(role.createdAt)}
                    </td>
                  </tr>
                </Fragment>
              ))}
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
