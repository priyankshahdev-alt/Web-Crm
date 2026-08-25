import type {
  ActivityLog,
  ApprovalRequest,
  Blog,
  BlogCategory,
  CmsForm,
  CmsPage,
  DashboardStats,
  Event,
  Faq,
  Gallery,
  MediaAsset,
  MediaFolder,
  Menu,
  Notification,
  Partner,
  ProfileUser,
  Project,
  SeoMeta,
  TeamMember,
  Testimonial,
  WebsiteSettings,
} from '../types'
import { buildSeed } from '../data/seed'
import { uuid } from '../utils/uuid'
import { getSession } from '../lib/session'

const STORAGE_PREFIX = 'webcms.'
const SEED_VERSION = 'v1'

export interface SeedShape {
  pages: CmsPage[]
  menus: Menu[]
  projects: Project[]
  events: Event[]
  blogs: Blog[]
  blogCategories: BlogCategory[]
  galleries: Gallery[]
  team: TeamMember[]
  testimonials: Testimonial[]
  partners: Partner[]
  faqs: Faq[]
  media: MediaAsset[]
  folders: MediaFolder[]
  forms: CmsForm[]
  seo: SeoMeta[]
  settings: WebsiteSettings[]
  activity: ActivityLog[]
  approvals: ApprovalRequest[]
  notifications: Notification[]
  stats: DashboardStats[]
  profile: ProfileUser[]
}

export type StoreKey = keyof SeedShape

function keyOf(name: StoreKey): string {
  return `${STORAGE_PREFIX}${namespaceOf()}.${name}.${SEED_VERSION}`
}

/**
 * Namespace the local repo per organization so switching accounts can never
 * leak or share another website's data. Falls back to a shared key only when
 * no session exists yet (e.g. pre-login writes).
 */
function namespaceOf(): string {
  const session = getSession()
  return session?.currentOrgId ?? session?.currentOrgSlug ?? 'anonymous'
}

function readRaw<T>(name: StoreKey): T {
  try {
    const raw = localStorage.getItem(keyOf(name))
    if (!raw) throw new Error('empty')
    return JSON.parse(raw) as T
  } catch {
    const seed = buildSeed()[name]
    localStorage.setItem(keyOf(name), JSON.stringify(seed))
    return seed as T
  }
}

function writeRaw<T>(name: StoreKey, value: T): void {
  localStorage.setItem(keyOf(name), JSON.stringify(value))
}

export interface Paginated<T> {
  items: T[]
  total: number
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  folder?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const delay = (ms = 240): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

function paginate<T>(items: T[], params: ListParams): Paginated<T> {
  const pageSize = params.pageSize ?? 10
  const page = params.page ?? 1
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
  }
}

function matchesSearch<T>(item: T, search: string, fields: (keyof T)[]): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return fields.some((field) => {
    const value = item[field]
    if (typeof value === 'string') return value.toLowerCase().includes(q)
    return false
  })
}

/**
 * Lightweight localStorage-backed repository that mirrors the backend REST
 * API. It is used as an offline fallback so the CMS is fully explorable even
 * when the Node backend is not running.
 */
export const store = {
  async list<T>(name: StoreKey, params: ListParams = {}): Promise<Paginated<T>> {
    await delay(180)
    let items = readRaw<T[]>(name) as unknown as T[]
    const searchable = SEARCHABLE_FIELDS[name] as (keyof T)[] | undefined
    if (params.search && searchable) {
      items = items.filter((item) => matchesSearch(item, params.search ?? '', searchable))
    }
    if (params.status) {
      items = items.filter(
        (item) => (item as Record<string, unknown>).status === params.status,
      )
    }
    if (params.folder) {
      items = items.filter(
        (item) => (item as Record<string, unknown>).folder === params.folder,
      )
    }
    const sortBy = params.sortBy as keyof T | undefined
    if (sortBy) {
      const dir = params.sortOrder === 'asc' ? 1 : -1
      items = [...items].sort((a, b) => {
        const av = a[sortBy]
        const bv = b[sortBy]
        if (typeof av === 'string' && typeof bv === 'string') {
          return av.localeCompare(bv) * dir
        }
        return 0
      })
    }
    return paginate(items, params)
  },

  async all<T>(name: StoreKey): Promise<T[]> {
    await delay(120)
    return readRaw<T[]>(name)
  },

  async get<T>(name: StoreKey, id: string): Promise<T | null> {
    await delay(120)
    const items = readRaw<T[]>(name)
    return items.find((item) => (item as { id: string }).id === id) ?? null
  },

  async create<T>(name: StoreKey, item: Partial<T> & { id?: string }): Promise<T> {
    await delay(260)
    const items = readRaw<T[]>(name)
    const now = new Date().toISOString()
    const created = {
      ...item,
      id: item.id ?? uuid(),
      createdAt: now,
      updatedAt: now,
    } as unknown as T
    writeRaw(name, [...items, created])
    return created
  },

  async update<T>(name: StoreKey, id: string, patch: Partial<T>): Promise<T | null> {
    await delay(260)
    const items = readRaw<T[]>(name)
    let updated: T | null = null
    const next = items.map((item) => {
      if ((item as { id: string }).id === id) {
        updated = { ...item, ...patch, id, updatedAt: new Date().toISOString() } as T
        return updated
      }
      return item
    })
    writeRaw(name, next)
    return updated
  },

  async remove<T>(name: StoreKey, id: string): Promise<void> {
    await delay(160)
    const items = readRaw<T[]>(name)
    writeRaw(name, items.filter((item) => (item as { id: string }).id !== id))
  },

  async set<T>(name: StoreKey, value: T): Promise<T> {
    await delay(160)
    writeRaw(name, value)
    return value
  },

  async push(name: StoreKey, entry: Record<string, unknown>): Promise<void> {
    await delay(120)
    const items = readRaw<unknown[]>(name)
    items.push({ ...entry, createdAt: new Date().toISOString() })
    writeRaw(name, items)
  },

  reset(): void {
    // Remove every webcms.* key regardless of namespace so switching users or
    // signing out can never leak a previous organization's cached data.
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key)
    }
    for (const key of keys) localStorage.removeItem(key)
  },
}

const SEARCHABLE_FIELDS: Partial<Record<StoreKey, string[]>> = {
  pages: ['title', 'slug', 'author'],
  projects: ['title', 'slug', 'tag'],
  events: ['title', 'slug', 'location'],
  blogs: ['title', 'excerpt', 'authorName'],
  galleries: ['title', 'slug', 'description'],
  team: ['name', 'role'],
  testimonials: ['name', 'quote', 'personType', 'location'],
  partners: ['name', 'website'],
  faqs: ['question', 'answer'],
  media: ['fileName', 'folder'],
  forms: ['name', 'description'],
  approvals: ['resourceTitle', 'resourceType'],
  notifications: ['title', 'body'],
}
