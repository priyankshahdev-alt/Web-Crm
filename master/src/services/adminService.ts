import type { AdminUser, CreateAdminInput, UpdateAdminInput } from '../types/admin'

const STORAGE_KEY = 'master-crm.admins.v1'
const STORAGE_OWNER_KEY = 'master-crm.current-master'

const CURRENT_MASTER = 'master'

export class DuplicateUsernameError extends Error {
  constructor(public readonly username: string) {
    super(`Username "${username}" is already taken`)
    this.name = 'DuplicateUsernameError'
  }
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const readStored = (): AdminUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AdminUser[]) : []
  } catch {
    return []
  }
}

const persist = (admins: AdminUser[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(admins))
  localStorage.setItem(STORAGE_OWNER_KEY, CURRENT_MASTER)
  window.dispatchEvent(new CustomEvent('admins:updated'))
}

export const adminService = {
  async list(): Promise<AdminUser[]> {
    await delay(200)
    return readStored()
  },

  async usernameExists(username: string): Promise<boolean> {
    await delay(150)
    const normalized = username.trim().toLowerCase()
    if (!normalized) return false
    return readStored().some(
      (admin) => admin.username.toLowerCase() === normalized,
    )
  },

  async create(input: CreateAdminInput): Promise<AdminUser> {
    await delay(450)
    const admins = readStored()
    const normalized = input.username.trim()
    const usernameTaken = admins.some(
      (admin) => admin.username.toLowerCase() === normalized.toLowerCase(),
    )
    if (usernameTaken) {
      throw new DuplicateUsernameError(input.username)
    }

    const now = new Date().toISOString()
    const admin: AdminUser = {
      id: crypto.randomUUID(),
      username: normalized,
      password: input.password,
      role: input.role,
      status: input.status ?? 'active',
      createdAt: now,
      createdBy: CURRENT_MASTER,
      lastLoginAt: null,
    }
    if (input.managedWebsites) {
      admin.managedWebsites = input.managedWebsites
    }

    persist([...admins, admin])
    return admin
  },

  async update(id: string, input: UpdateAdminInput): Promise<AdminUser> {
    await delay(450)
    const admins = readStored()
    const existing = admins.find((admin) => admin.id === id)
    if (!existing) {
      throw new Error('Admin not found')
    }

    const normalized = input.username.trim()
    const usernameTaken = admins.some(
      (admin) =>
        admin.id !== id &&
        admin.username.toLowerCase() === normalized.toLowerCase(),
    )
    if (usernameTaken) {
      throw new DuplicateUsernameError(input.username)
    }

    const updated: AdminUser = {
      ...existing,
      username: normalized,
      password: input.password ?? existing.password,
      role: input.role,
      status: input.status,
      managedWebsites: input.managedWebsites,
    }

    persist(admins.map((admin) => (admin.id === id ? updated : admin)))
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay(200)
    persist(readStored().filter((admin) => admin.id !== id))
  },
}
