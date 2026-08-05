/** Authenticated user summary from `/auth/me` and `/auth/login`. */
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string | null
  isMaster: boolean
  roles: string[]
  permissions?: string[]
}

export interface SessionOrganization {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  role: string
  roleName: string
  isCurrent: boolean
}

/** Full login response. */
export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: AuthUser
  organizations: SessionOrganization[]
}

/** `/auth/me` response. */
export interface MeResponse {
  user: AuthUser
  organizations: SessionOrganization[]
}

export interface LoginInput {
  email: string
  password: string
}
