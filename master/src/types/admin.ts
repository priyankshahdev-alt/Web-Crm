export type AdminStatus = 'active' | 'disabled'

export type AdminRole = 'master' | 'site'

export interface AdminUser {
  id: string
  username: string
  password: string
  role: AdminRole
  status: AdminStatus
  createdAt: string
  createdBy: string
  lastLoginAt: string | null
  managedWebsites?: string[]
}

export interface CreateAdminInput {
  username: string
  password: string
  role: AdminRole
  status?: AdminStatus
  managedWebsites?: string[]
}

export interface UpdateAdminInput {
  username: string
  password?: string
  role: AdminRole
  status: AdminStatus
  managedWebsites: string[]
}
