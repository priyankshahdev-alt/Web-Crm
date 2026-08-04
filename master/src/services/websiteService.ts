import { http } from '../lib/api'
import type { ManagedWebsite } from '../types/website'

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
    const rows = await http.get<OrganizationRow[]>('/dashboard/websites')
    return rows.map((row) => ({
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
}
