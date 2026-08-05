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
