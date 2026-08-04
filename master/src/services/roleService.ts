import { http } from '../lib/api'
import { withCache, invalidate } from '../lib/cache'
import type { Role } from '../types/role'

const ROLES_UPDATED_EVENT = 'roles:updated'
const ROLES_LIST_KEY = 'roles:list'
const ROLES_LIST_TTL_MS = 10_000

interface ServerRole {
  id: string
  name: string
  key: string
  description: string | null
  isSystem: boolean
  createdAt: string
  _count?: { memberships: number }
}

function toRole(role: ServerRole): Role {
  return {
    id: role.id,
    name: role.name,
    key: role.key,
    description: role.description ?? '',
    isSystem: role.isSystem,
    createdAt: role.createdAt,
    memberCount: role._count?.memberships ?? 0,
  }
}

/** Build a unique `key` for a new role from its name. */
function keyFromName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return base || 'role'
}

export const roleService = {
  async list(): Promise<Role[]> {
    const roles = await withCache(ROLES_LIST_KEY, ROLES_LIST_TTL_MS, () =>
      http.get<ServerRole[]>('/roles'),
    )
    return roles.map(toRole)
  },

  async create(input: { name: string; description: string }): Promise<Role> {
    const role = await http.post<ServerRole>('/roles', {
      name: input.name.trim(),
      key: keyFromName(input.name),
      description: input.description.trim() || null,
    })
    invalidate(ROLES_LIST_KEY)
    window.dispatchEvent(new CustomEvent(ROLES_UPDATED_EVENT))
    return toRole(role)
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/roles/${id}`)
    invalidate(ROLES_LIST_KEY)
    window.dispatchEvent(new CustomEvent(ROLES_UPDATED_EVENT))
  },
}

export { ROLES_UPDATED_EVENT }
