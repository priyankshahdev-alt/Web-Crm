import type { Role } from '../types/role'
import { randomUUID } from '../utils/uuid'

const STORAGE_KEY = 'master-crm.roles.v1'

const ROLES_UPDATED_EVENT = 'roles:updated'

const makeRole = (
  id: string,
  name: string,
  description: string,
): Role => ({
  id,
  name,
  description,
  createdAt: new Date().toISOString(),
})

const seedRoles = (): Role[] => [
  makeRole('role-admin', 'Admin', 'Access to a single managed website'),
  makeRole(
    'role-website-user',
    'Website User',
    'View-only access to website data',
  ),
]

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const readStored = (): Role[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedRoles()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return seedRoles()
    const stored = parsed.filter(
      (role): role is Role =>
        !!role &&
        typeof role === 'object' &&
        'id' in role &&
        'name' in role &&
        'description' in role &&
        'createdAt' in role,
    )
    const withoutStale = stored.filter(
      (role) =>
        role.name !== 'Master Admin' && role.name !== 'Site Admin',
    )
    const existingNames = new Set(withoutStale.map((role) => role.name))
    const defaults = seedRoles().filter((role) => !existingNames.has(role.name))
    const merged = [...defaults, ...withoutStale]
    if (merged.length !== stored.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    }
    return merged
  } catch {
    return seedRoles()
  }
}

export const roleService = {
  async list(): Promise<Role[]> {
    await delay(200)
    return readStored()
  },

  async create(input: { name: string; description: string }): Promise<Role> {
    await delay(450)
    const roles = readStored()
    const role: Role = {
      id: randomUUID(),
      name: input.name.trim(),
      description: input.description.trim(),
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...roles, role]))
    window.dispatchEvent(new CustomEvent(ROLES_UPDATED_EVENT))
    return role
  },

  async remove(id: string): Promise<void> {
    await delay(200)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(readStored().filter((role) => role.id !== id)),
    )
    window.dispatchEvent(new CustomEvent(ROLES_UPDATED_EVENT))
  },
}

export { ROLES_UPDATED_EVENT }
