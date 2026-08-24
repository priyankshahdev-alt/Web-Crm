import { http } from '../lib/api'
import { withCache } from '../lib/cache'
import type {
  ManagedWebsite,
  SiteAdmin,
  SiteDetail,
  SiteUser,
} from '../types/website'

const WEBSITES_LIST_KEY = 'websites:list'
const WEBSITES_LIST_TTL_MS = 30_000

const TEST_FIXTURE_SLUGS = new Set(['mann-local-test', 'master-int-1785837202'])

interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

interface SiteUserRow {
  id: string
  isCurrent: boolean
  isActive: boolean
  createdAt: string
  role: { id: string; key: string; name: string } | null
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    isActive: boolean
    lastLoginAt: string | null
  }
}

interface SiteAdminRow {
  id: string
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    isActive: boolean
    createdAt: string
  }
}

export interface DashboardOverview {
  organizations: number
  users: number
  projects: number
  pages: number
  media: number
  events: number
  campaigns: number
  donations: number
  recentDonations: Array<{
    id: string
    amount: number
    currency: string
    status: string
    donorName: string | null
    receiptNumber: string | null
    createdAt: string
    organization?: { id: string; slug: string; name: string }
  }>
}

interface OrganizationRow {
  id: string
  name: string
  slug: string
  status: string
  plan: string
  description: string | null
  website: string | null
  createdAt: string
  _count?: { users: number; projects: number; pages: number; donations: number }
}

export const websiteService = {
  async list(): Promise<ManagedWebsite[]> {
    const rows = await withCache(WEBSITES_LIST_KEY, WEBSITES_LIST_TTL_MS, () =>
      http.get<OrganizationRow[]>('/dashboard/websites'),
    )
    return rows
      .filter((row) => !TEST_FIXTURE_SLUGS.has(row.slug))
      .map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      url:
        row.website?.replace(/^https?:\/\//, '') ||
        `${row.slug}.webcrm.local`,
      description: row.description ?? 'Managed by WebCrm',
      status: row.status,
      plan: row.plan,
      createdAt: row.createdAt,
      pages: row._count?.pages ?? 0,
    }))
  },

  async overview(): Promise<DashboardOverview> {
    return http.get<DashboardOverview>('/dashboard/overview')
  },

  async detail(id: string): Promise<SiteDetail> {
    return http.get<SiteDetail>(`/dashboard/websites/${id}`)
  },

  async users(id: string): Promise<SiteUser[]> {
    const result = await http.get<Paginated<SiteUserRow>>(
      `/organizations/${id}/users?limit=100`,
    )
    return result.items.map((row) => ({
      id: row.user.id,
      email: row.user.email,
      firstName: row.user.firstName,
      lastName: row.user.lastName,
      phone: row.user.phone,
      isActive: row.user.isActive,
      lastLoginAt: row.user.lastLoginAt,
      joinedAt: row.createdAt,
      role: row.role?.key ?? null,
      roleName: row.role?.name ?? null,
    }))
  },

  async admins(id: string): Promise<SiteAdmin[]> {
    const rows = await http.get<SiteAdminRow[]>(
      `/organizations/${id}/admins`,
    )
    return rows.map((row) => ({
      id: row.user.id,
      email: row.user.email,
      firstName: row.user.firstName,
      lastName: row.user.lastName,
      isActive: row.user.isActive,
      createdAt: row.user.createdAt,
    }))
  },
}
