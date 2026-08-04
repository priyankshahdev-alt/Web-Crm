export interface Role {
  id: string
  name: string
  key: string
  description: string
  isSystem: boolean
  createdAt: string
  memberCount?: number
}
