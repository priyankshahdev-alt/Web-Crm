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
  ogImageUrl?: string | null
  canonicalUrl?: string | null
  robots?: string | null
  keywords?: string[] | null
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
  template?: {
    id: string
    type: string
    name: string
    label: string
    isSystem: boolean
    fields: FieldDef[]
  }
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richText'
  | 'url'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image'
  | 'gallery'
  | 'link'
  | 'entityRef'
  | 'group'
  | 'list'
  | 'repeater'
  | 'date'

export interface BaseFieldDef {
  name: string
  label: string
  required?: boolean
  help?: string
  placeholder?: string
  default?: unknown
}

export interface ScalarFieldDef extends BaseFieldDef {
  type: 'text' | 'textarea' | 'richText' | 'url' | 'date'
  maxLength?: number
}
export interface NumberFieldDef extends BaseFieldDef {
  type: 'number'
  min?: number
  max?: number
}
export interface BooleanFieldDef extends BaseFieldDef {
  type: 'boolean'
}
export interface SelectFieldDef extends BaseFieldDef {
  type: 'select'
  options: string[]
}
export interface ImageFieldDef extends BaseFieldDef {
  type: 'image'
}
export interface GalleryFieldDef extends BaseFieldDef {
  type: 'gallery'
  maxItems?: number
}
export interface LinkFieldDef extends BaseFieldDef {
  type: 'link'
}
export interface EntityRefFieldDef extends BaseFieldDef {
  type: 'entityRef'
  entityType: string
  multiple?: boolean
}
export interface GroupFieldDef extends BaseFieldDef {
  type: 'group'
  fields: FieldDef[]
}
export interface ListFieldDef extends BaseFieldDef {
  type: 'list'
  itemType: 'string' | 'number'
  maxItems?: number
}
export interface RepeaterFieldDef extends BaseFieldDef {
  type: 'repeater'
  minItems?: number
  maxItems?: number
  fields: FieldDef[]
}

export type FieldDef =
  | ScalarFieldDef
  | NumberFieldDef
  | BooleanFieldDef
  | SelectFieldDef
  | ImageFieldDef
  | GalleryFieldDef
  | LinkFieldDef
  | EntityRefFieldDef
  | GroupFieldDef
  | ListFieldDef
  | RepeaterFieldDef

export interface SectionTemplate {
  id: string
  type: string
  name: string
  label: string
  description?: string | null
  isSystem: boolean
  fields: FieldDef[]
}

export interface TemplateFieldDef {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'richText'
    | 'number'
    | 'boolean'
    | 'url'
    | 'select'
    | 'image'
    | 'gallery'
    | 'link'
    | 'entityRef'
    | 'list'
    | 'repeater'
    | 'group'
    | 'date'
  maxLength?: number
  itemType?: 'string' | 'number'
  minItems?: number
  maxItems?: number
  default?: unknown
  fields?: TemplateFieldDef[]
  options?: string[]
  entityType?: string
  multiple?: boolean
}

export interface WebsiteSectionField {
  name: string
  label: string
  type: string
  value: unknown
  imageUrl: string | null
  displayOrder: number
  def?: TemplateFieldDef | null
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
  hasChanges?: boolean
  draftName?: string | null
  draftIsActive?: boolean | null
  draftSettings?: Record<string, unknown> | null
  draftContent?: Record<string, unknown> | null
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
    website?: string | null
    email?: string | null
    phone?: string | null
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

export interface ProjectImageItem {
  id?: string
  imageUrl: string
  altText?: string | null
  sortOrder?: number
}

export interface ProjectServiceItem {
  id?: string
  title: string
  description?: string | null
  icon?: string | null
  imageUrl?: string | null
  sortOrder?: number
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
  isHidden?: boolean
  sortOrder: number
  images?: ProjectImageItem[] | null
  services?: ProjectServiceItem[] | null
  stats: ProjectStat[]
  impacts?: ProjectImpact[] | null
  _count?: { beneficiaries: number; images: number; stats: number }
}

export interface ProjectStat {
  id: string
  label: string
  value: string
  sortOrder: number
}

export interface ProjectImpact {
  id: string
  title: string
  description?: string | null
  icon?: string | null
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
  isHidden?: boolean
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
  programId?: string | null
  program?: { id: string; title: string; slug: string } | null
  eventId?: string | null
  event?: { id: string; title: string; slug: string; startDate?: string | null } | null
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
  isHidden?: boolean
  programId?: string | null
  eventId?: string | null
  program?: { id: string; title: string; slug: string } | null
  event?: { id: string; title: string; slug: string; startDate?: string | null } | null
  photos?: number
  videos?: number
  items?: GalleryItem[] | null
}

export interface GalleryItem {
  id: string
  mediaId?: string | null
  imageUrl: string
  mediaType?: 'image' | 'video'
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
  rating?: number | null
  personType?: string | null
  location?: string | null
  programId?: string | null
  program?: { id: string; title: string; slug: string } | null
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
  helpText?: string
  required: boolean
  options?: string[]
}

export interface CmsForm extends IdEntity {
  name: string
  description?: string | null
  fields: FormField[]
  submissions: number
  status: 'ACTIVE' | 'DRAFT'
  submitLabel?: string | null
  successMessage?: string | null
}

export interface FormEntry extends IdEntity {
  formId: string
  data: Record<string, string>
  status: 'NEW' | 'READ' | 'ARCHIVED'
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

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'REVIEW' | 'LOGIN' | 'LOGOUT' | 'UNPUBLISH' | string

export interface ActivityLogUser {
  id: string
  email: string
  firstName: string
  lastName?: string | null
  avatarUrl?: string | null
}

export interface ActivityLog extends IdEntity {
  userId?: string | null
  organizationId?: string | null
  action: string
  resource: string
  resourceId?: string | null
  message?: string | null
  before?: unknown
  after?: unknown
  ipAddress?: string | null
  userAgent?: string | null
  user?: ActivityLogUser | null
  organization?: { id: string; name: string; slug: string } | null
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'CANCELLED'

export interface ApprovalRequest {
  id: string
  organizationId: string
  resourceId: string
  resourceType: string
  resourceTitle: string
  action: string
  status: ApprovalStatus
  submitterNote?: string | null
  reviewerNote?: string | null
  submitter?: { id: string; firstName: string; lastName?: string | null; email: string; avatarUrl?: string | null } | null
  reviewer?: { id: string; firstName: string; lastName?: string | null; email: string } | null
  submittedAt: string
  reviewedAt?: string | null
  contentSnapshot?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  events: ApprovalEvent[]
}

export interface ApprovalEvent {
  id: string
  requestId: string
  actorName: string
  actorId?: string | null
  action: string
  note?: string | null
  createdAt: string
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

  // Detailed content counts
  pages: { total: number; published: number; draft: number; archived: number }
  projects: { total: number; published: number; draft: number }
  events: { total: number; published: number; draft: number; upcoming: number; past: number }
  blogs: { total: number; published: number; draft: number }
  galleries: { total: number; published: number; draft: number }
  campaigns: { total: number; published: number; draft: number }
  media: { total: number; images: number; documents: number; folders: number; storageBytes: number }
  team: { total: number; active: number }
  testimonials: { total: number; active: number }
  partners: { total: number; active: number }
  faqs: { total: number; active: number }
  beingSevakImages: { total: number }

  // Widget data
  upcomingEvents: { id: string; title: string; startDate: string; endDate?: string; location?: string; status: string; slug: string }[]
  recentForms: { id: string; name: string; status: string; submissions: number; fields: number }[]
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
