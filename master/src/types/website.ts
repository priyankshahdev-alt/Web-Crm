/** A managed website (server Organization) as shown in the master panel. */
export interface ManagedWebsite {
  id: string
  name: string
  slug: string
  url: string
  description: string
  status: string
  plan: string
  createdAt: string
  pages: number
}

export interface SiteUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  isActive: boolean
  lastLoginAt: string | null
  joinedAt: string
  role: string | null
  roleName: string | null
}

export interface SiteAdmin {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  isActive: boolean
  createdAt: string
}

export interface SiteStats {
  users: number
  projects: number
  pages: number
  media: number
  events: number
  campaigns: number
  donations: number
}

export interface SiteDetail {
  organization: ManagedWebsite
  counts: SiteStats
  recentDonations: Array<{
    id: string
    amount: number
    currency: string
    status: string
    donorName: string | null
    receiptNumber: string | null
    createdAt: string
  }>
}
