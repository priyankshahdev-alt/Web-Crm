/** Organization operational status. */
export type OrgStatus = 'ACTIVE' | 'SUSPENDED'

/** Pagination envelope returned by list endpoints. */
export interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Counts attached to organization list/detail payloads. */
export interface OrgCounts {
  users: number
  projects: number
  pages: number
  donations: number
}

/** A managed website (organization) as returned by the API. */
export interface Organization {
  id: string
  name: string
  slug: string
  status: OrgStatus
  plan: string
  description: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  logoUrl: string | null
  taxId: string | null
  createdAt: string
  updatedAt: string
  _count?: OrgCounts
}

/** Payload used when creating a website. */
export interface OrganizationInput {
  name: string
  website: string
  email?: string | null
  phone?: string | null
  description?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  taxId?: string | null
  plan?: string
}

/** Fields accepted when updating a website. */
export interface OrganizationUpdateInput {
  name?: string
  email?: string | null
  phone?: string | null
  website?: string | null
  description?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  taxId?: string | null
  logoUrl?: string | null
  plan?: string
  status?: OrgStatus
}

/** Auto-created website-user credential returned once at organization creation. */
export interface WebUserCredential {
  id: string
  email: string
  password?: string
  generated: boolean
}

export interface OrganizationCreateResult extends Organization {
  webUser: WebUserCredential
}

/** A website user (organization member). */
export interface OrganizationMember {
  id: string
  isCurrent: boolean
  isActive: boolean
  createdAt: string
  role: { id: string; key: string; name: string }
  user: {
    id: string
    email: string
    firstName: string
    lastName: string | null
    phone: string | null
    isActive: boolean
    lastLoginAt: string | null
  }
}

/** A platform admin assigned to a website. */
export interface AssignedAdmin {
  id: string
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string | null
    isActive: boolean
    createdAt: string
  }
}

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

/** Dashboard overview counts. */
export interface DashboardOverview {
  organizations: number
  users: number
  projects: number
  pages: number
  media: number
  events: number
  campaigns: number
  donations: number
  recentDonations: RecentDonation[]
}

export interface RecentDonation {
  id: string
  amount: number
  currency: string
  status: string
  donorName: string | null
  receiptNumber: string | null
  createdAt: string
  organization?: { id: string; slug: string; name: string }
}

/** Per-site dashboard payload. */
export interface SiteStats {
  organization: (Organization & { _count: OrgCounts }) | null
  counts: {
    users: number
    projects: number
    pages: number
    media: number
    events: number
    campaigns: number
    donations: number
  }
  recentDonations: RecentDonation[]
}

/** Profile fields editable by the current user. */
export interface ProfileUpdateInput {
  email?: string
  firstName?: string
  lastName?: string | null
  phone?: string | null
  avatarUrl?: string | null
}

/** User record as returned by `PATCH /users/:id`. */
export interface UserRecord {
  id: string
  email: string
  firstName: string
  lastName: string | null
  phone: string | null
  avatarUrl: string | null
  isMaster: boolean
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

/** A website API key (raw secret only present on create). */
export interface ApiKeyRecord {
  id: string
  name: string
  keyPrefix: string
  scopes: string[]
  isActive: boolean
  lastUsedAt: string | null
  expiresAt: string | null
  revokedAt: string | null
  createdAt: string
  key?: string
  note?: string
}

export interface ApiKeyCreateInput {
  name: string
  scopes?: string[]
}

export type DomainVerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED'
export type DomainVerificationMethod = 'META_TAG' | 'FILE' | 'DNS_TXT'

export interface VerifiedDomain {
  id: string
  domain: string
  method: DomainVerificationMethod
  status: DomainVerificationStatus
  token: string
  verifiedAt: string | null
  lastCheckedAt: string | null
  createdAt: string
  instructions?: string[]
  apiKey?: {
    id: string
    key: string
    keyPrefix: string
    name: string
    scopes: string[]
  }
}

