export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface IdEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface WebsiteEditorOrg {
  id: string
  name: string
  slug: string
  description?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  logoUrl?: string | null
}

export interface WebsiteSectionTemplate {
  id: string
  type: string
  name: string
  label: string
  isSystem: boolean
  fields: unknown[]
}

export interface WebsiteEditorSection {
  id: string
  type: string
  name: string | null
  sortOrder: number
  isActive: boolean
  settings: Record<string, unknown>
  content: Record<string, unknown>
  template?: WebsiteSectionTemplate | null
}

export interface WebsiteEditorPage {
  id: string
  slug: string
  title: string
  metaTitle?: string | null
  metaDescription?: string | null
  status: PublishStatus
  isHome: boolean
  sections: WebsiteEditorSection[]
}

export interface WebsiteEditorData {
  website: WebsiteEditorOrg
  settings: Record<string, string>
  menus: Menu[]
  banners: unknown[]
  sliders: unknown[]
  liveUrl: string
  page: WebsiteEditorPage
}

export interface Website {
  id: string
  name: string
  url: string
  description: string
  logoUrl?: string | null
  faviconUrl?: string | null
}

export interface CmsPage extends IdEntity {
  slug: string
  title: string
  metaTitle?: string | null
  metaDescription?: string | null
  status: PublishStatus
  template: string
  sortOrder: number
  isHome: boolean
  author: string
  sections: PageSection[]
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'programs'
  | 'gallery'
  | 'testimonials'
  | 'partners'
  | 'faq'
  | 'footer'
  | 'cta'
  | 'stats'
  | 'contact'
  | 'html'

export interface PageSection extends IdEntity {
  pageId: string
  type: string
  name?: string | null
  sortOrder: number
  isActive: boolean
  settings: Record<string, unknown>
  content: Record<string, unknown>
  fields?: WebsiteSectionField[]
}

export interface WebsiteSectionField {
  name: string
  label: string
  type: string
  value: unknown
  imageUrl: string | null
  displayOrder: number
}

export interface WebsiteSection {
  id: string
  component: string
  sectionName: string | null
  displayOrder: number
  status: 'ACTIVE' | 'INACTIVE'
  settings: Record<string, unknown>
  content: Record<string, unknown>
  fields: WebsiteSectionField[]
  createdAt: string
  updatedAt: string
}

export interface WebsitePage {
  id: string
  slug: string
  title: string
  metaTitle: string | null
  metaDescription: string | null
  status: string
  template: string
  sortOrder: number
  isHome: boolean
  createdAt: string
  updatedAt: string
  sections: WebsiteSection[]
}

export interface SiteSettings {
  site?: {
    siteName?: string | null
    siteTitle?: string | null
    siteLogo?: string | null
    favicon?: string | null
    description?: string | null
    [key: string]: unknown
  }
  contact?: Record<string, unknown>
  [key: string]: unknown
}

export interface WebsiteContent {
  website: {
    id: string
    name: string
    slug: string
    description: string | null
    logoUrl: string | null
    status: string
    updatedAt: string
  }
  settings: SiteSettings
  pages: WebsitePage[]
}

export interface MenuItem {
  id: string
  label: string
  url?: string | null
  entityType?: string | null
  entityId?: string | null
  sortOrder: number
  isActive: boolean
  parentId?: string | null
  children: MenuItem[]
}

export interface Menu extends IdEntity {
  name: string
  location: string
  items: MenuItem[]
}

export interface Project extends IdEntity {
  slug: string
  title: string
  tag?: string | null
  summary?: string | null
  description?: Record<string, unknown> | null
  heroImageUrl?: string | null
  cardImageUrl?: string | null
  category?: string | null
  status: PublishStatus
  featured: boolean
  sortOrder: number
  stats: ProjectStat[]
}

export interface ProjectStat {
  id: string
  label: string
  value: string
  sortOrder: number
}

export interface Event extends IdEntity {
  slug: string
  title: string
  description?: Record<string, unknown> | null
  imageUrl?: string | null
  startDate: string | null
  endDate: string | null
  location?: string | null
  status: PublishStatus
  featured: boolean
  gallery: string[]
}

export interface BlogCategory extends IdEntity {
  name: string
  slug: string
}

export interface Blog extends IdEntity {
  slug: string
  title: string
  excerpt?: string | null
  content?: Record<string, unknown> | null
  coverImageUrl?: string | null
  authorName?: string | null
  categoryId?: string | null
  category?: { id: string; name: string; slug: string } | null
  publishedAt: string | null
  status: PublishStatus
  featured: boolean
  tags: string[]
  seo?: { title?: string; description?: string; keywords?: string[] } | null
}

export interface Gallery extends IdEntity {
  slug: string
  title: string
  description?: string | null
  coverImageUrl?: string | null
  status: PublishStatus
  items: GalleryItem[]
}

export interface GalleryItem {
  id: string
  imageUrl: string
  altText?: string | null
  caption?: string | null
  sortOrder: number
}

export interface TeamMember extends IdEntity {
  name: string
  role?: string | null
  photoUrl?: string | null
  bio?: string | null
  socials: { facebook?: string; twitter?: string; linkedin?: string; instagram?: string }
  sortOrder: number
  isActive: boolean
}

export interface Testimonial extends IdEntity {
  quote: string
  name: string
  role?: string | null
  avatarUrl?: string | null
  rating: number
  isActive: boolean
  sortOrder: number
}

export interface Partner extends IdEntity {
  name: string
  website?: string | null
  logoUrl?: string | null
  description?: string | null
  sortOrder: number
  isActive: boolean
}

export interface Faq extends IdEntity {
  question: string
  answer: string
  category?: string | null
  sortOrder: number
  isActive: boolean
}

export interface MediaAsset extends IdEntity {
  fileName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string | null
  folder?: string | null
  altText?: string | null
  width?: number | null
  height?: number | null
}

export interface MediaFolder {
  id: string
  name: string
  count: number
}

export interface FormField {
  id: string
  type: 'text' | 'textarea' | 'email' | 'phone' | 'checkbox' | 'select' | 'date' | 'file'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface CmsForm extends IdEntity {
  name: string
  description?: string | null
  fields: FormField[]
  submissions: number
  status: 'ACTIVE' | 'DRAFT'
  entries: FormEntry[]
}

export interface FormEntry extends IdEntity {
  data: Record<string, string>
}

export interface SeoMeta {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImageUrl?: string | null
  canonicalUrl?: string | null
  robots: string
  schema?: Record<string, unknown> | null
}

export interface WebsiteSettings extends IdEntity {
  websiteName: string
  tagline?: string | null
  logoUrl?: string | null
  faviconUrl?: string | null
  primaryColor: string
  footerText?: string | null
  socialLinks: { facebook?: string; twitter?: string; linkedin?: string; instagram?: string; youtube?: string }
  contact: { email?: string; phone?: string; address?: string; city?: string; state?: string }
  analytics: { gaId?: string; pixelId?: string; tagManagerId?: string }
  connectedSite?: { url?: string | null; slug?: string | null }
}

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'REVIEW' | 'LOGIN' | 'LOGOUT'

export interface ActivityLog extends IdEntity {
  userId?: string | null
  userName: string
  action: ActivityAction
  resource: string
  resourceId?: string | null
  message?: string | null
  ipAddress?: string | null
  device: string
  status: 'success' | 'warning' | 'danger'
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ApprovalRequest extends IdEntity {
  type: string
  resource: string
  title: string
  submittedBy: string
  submittedAt: string
  status: ApprovalStatus
  comment?: string | null
  reviewedBy?: string | null
  reviewedAt?: string | null
  timeline: ApprovalTimelineEntry[]
}

export interface ApprovalTimelineEntry {
  id: string
  actor: string
  action: string
  note?: string | null
  at: string
}

export interface SiteSettingsValue {
  id: string
  key: string
  value: Record<string, unknown>
  description?: string | null
}

export interface Notification {
  id: string
  title: string
  body?: string | null
  type: 'info' | 'success' | 'warning' | 'danger'
  link?: string | null
  isRead: boolean
  createdAt: string
}

export interface DashboardStats {
  visitors: number
  visitorsChange: number
  pageViews: number
  pageViewsChange: number
  publishedPages: number
  draftPages: number
  pendingApprovals: number
  formsSubmitted: number
  storageUsed: number
  storageLimit: number
  visitsSeries: { label: string; visitors: number; pageViews: number }[]
  publishedSeries: { label: string; value: number }[]
  trafficByDevice: { name: string; value: number; color: string }[]
  topPages: { title: string; views: number; change: number }[]
}

export interface UserSession {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  avatarUrl?: string | null
  organizations: { id: string; name: string; slug: string; role: string; isCurrent: boolean }[]
}

export interface ProfileUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: string
  roleName: string
  avatarUrl?: string | null
  lastLoginAt?: string | null
  createdAt: string
  twoFactorEnabled: boolean
  sessions: SessionDevice[]
}

export interface SessionDevice {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  current: boolean
  lastActive: string
}

export interface Stat {
  label: string
  value: string
  change: number
  trend: 'up' | 'down'
}
