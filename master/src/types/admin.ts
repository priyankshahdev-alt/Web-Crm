export type AdminStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'disabled'

export type AdminRole = 'master' | 'site'

/** A platform admin (server User) as shown in the master panel. */
export interface AdminUser {
  id: string
  email: string
  username: string
  password: string
  role: AdminRole
  status: AdminStatus
  createdAt: string
  createdBy: string
  lastLoginAt: string | null
  managedWebsites: string[]
}

export interface CreateAdminInput {
  email: string
  password: string
  status?: AdminStatus
  managedWebsites?: string[]
}

export interface UpdateAdminInput {
  email: string
  password?: string
  status: AdminStatus
  managedWebsites: string[]
}
