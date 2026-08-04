import { http } from '../lib/api'
import type { AdminUser, CreateAdminInput, UpdateAdminInput } from '../types/admin'

interface ServerUser {
  id: string
  email: string
  firstName: string
  lastName: string | null
  isMaster: boolean
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  memberships?: Array<{
    organization: { id: string; slug: string; name: string }
  }>
  assignments?: Array<{
    organization: { id: string; slug: string; name: string }
  }>
  roles?: Array<{ role: { key: string; name: string } }>
}

interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

const ADMIN_ROLE_KEY = 'admins'

function toAdminUser(user: ServerUser): AdminUser {
  return {
    id: user.id,
    email: user.email,
    username: user.email,
    password: '',
    role: user.isMaster ? 'master' : 'site',
    status: user.isActive ? 'active' : 'disabled',
    createdAt: user.createdAt,
    createdBy: '',
    lastLoginAt: user.lastLoginAt,
    managedWebsites: (user.assignments ?? []).map(
      (entry) => entry.organization.id,
    ),
  }
}

export class AdminCreateError extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message)
    this.name = 'AdminCreateError'
  }
}

/** Error message + optional field extracted from the API envelope. */
function readApiError(
  err: unknown,
  fallback = 'Something went wrong.',
): { message: string; field?: string } {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const data = (err as {
      response?: { data?: { message?: unknown; errors?: unknown } }
    }).response?.data
    if (typeof data?.message === 'string' && data.message) {
      const field = Array.isArray(data.errors)
        ? (data.errors[0]?.details?.[0]?.path?.[0] as string | undefined)
        : undefined
      return { message: data.message, field }
    }
  }
  return {
    message: err instanceof Error && err.message ? err.message : fallback,
  }
}

export const adminService = {
  async list(): Promise<AdminUser[]> {
    const result = await http.get<Paginated<ServerUser>>('/users?limit=100')
    return result.items
      .filter(
        (user) =>
          user.isMaster ||
          (user.roles ?? []).some((entry) => entry.role.key === ADMIN_ROLE_KEY),
      )
      .map(toAdminUser)
  },

  async create(input: CreateAdminInput): Promise<AdminUser> {
    const email = input.email.trim().toLowerCase()
    const created = await http.post<ServerUser>('/users', {
      email,
      password: input.password,
      firstName: email.split('@')[0] || 'Admin',
      role: ADMIN_ROLE_KEY,
      isActive: input.status !== 'disabled',
    })

    const assignments = input.managedWebsites ?? []
    for (const organizationId of assignments) {
      await http.post(`/organizations/${organizationId}/admins`, {
        userId: created.id,
      })
    }

    return toAdminUser({
      ...created,
      assignments: assignments.map((organizationId) => ({
        organization: { id: organizationId, slug: '', name: '' },
      })),
    })
  },

  async update(id: string, input: UpdateAdminInput): Promise<AdminUser> {
    const updated = await http.patch<ServerUser>(`/users/${id}`, {
      email: input.email.trim().toLowerCase(),
      ...(input.password ? { password: input.password } : {}),
      isActive: input.status === 'active',
    })

    const current = new Set(input.managedWebsites)
    const existing = new Set(
      (updated.assignments ?? []).map((entry) => entry.organization.id),
    )
    const toAdd = [...current].filter((orgId) => !existing.has(orgId))
    const toRemove = [...existing].filter((orgId) => !current.has(orgId))

    for (const organizationId of toAdd) {
      await http.post(`/organizations/${organizationId}/admins`, { userId: id })
    }
    for (const organizationId of toRemove) {
      await http.delete(`/organizations/${organizationId}/admins/${id}`)
    }

    return toAdminUser({
      ...updated,
      assignments: [...current].map((organizationId) => ({
        organization: { id: organizationId, slug: '', name: '' },
      })),
    })
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/users/${id}`)
  },

  errorMessage: readApiError,
}
