import { http } from '../lib/api'
import type { AuditLogEntry, AuditLogPage } from '../types/audit'

/** Resources shown in the master activity feed: admins, websites, roles and CMS content. */
const RELEVANT_RESOURCES = new Set([
  'user',
  'organization',
  'role',
  'page',
  'section',
  'section-template',
  'media',
  'menu',
  'banner',
  'slider',
  'settings',
  'website',
  'project',
  'team',
  'event',
  'blog',
  'blog-category',
  'gallery',
  'document',
  'document-category',
  'testimonial',
  'partner',
  'faq',
  'campaign',
  'donor',
  'volunteer',
  'beneficiary',
  'employee',
  'department',
  'account',
  'transaction',
  'award',
  'location',
  'import',
])

const RELEVANT_ACTIONS = new Set([
  'CREATE',
  'UPDATE',
  'DELETE',
  'ASSIGN_ORG',
  'REMOVE_ORG',
  'ASSIGN_ADMIN',
  'UNASSIGN_ADMIN',
  'PUBLISH',
  'UNPUBLISH',
  'IMPORT',
])

const RECENT_LIMIT = 50

export const auditService = {
  async recent(limit = RECENT_LIMIT): Promise<AuditLogEntry[]> {
    const result = await http.get<AuditLogPage>(`/audit-logs?limit=${limit}`)
    return result.items.filter(
      (entry) =>
        RELEVANT_RESOURCES.has(entry.resource) &&
        RELEVANT_ACTIONS.has(entry.action),
    )
  },
}
