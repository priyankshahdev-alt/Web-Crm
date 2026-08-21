/** An audit log entry as returned by `GET /api/v1/audit-logs`. */
export interface AuditLogEntry {
  id: string
  organizationId: string | null
  userId: string | null
  action: string
  resource: string
  resourceId: string | null
  message: string | null
  createdAt: string
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string | null
  } | null
  organization?: {
    id: string
    name: string
    slug: string
  } | null
}

/** Paginated response envelope for `GET /api/v1/audit-logs`. */
export interface AuditLogPage {
  items: AuditLogEntry[]
  page: number
  limit: number
  total: number
  totalPages: number
}
