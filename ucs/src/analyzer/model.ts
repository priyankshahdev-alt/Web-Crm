export interface SiteSettings {
  siteName?: string | null;
  tagline?: string | null;
  description?: string | null;
  contact?: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  };
  social?: {
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
    whatsapp?: string | null;
  };
}

export interface SiteSection {
  type: string;
  name?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  settings?: unknown;
  content?: unknown;
}

export interface SitePage {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  template?: string;
  isHome?: boolean;
  sortOrder?: number;
  sections?: SiteSection[];
}

export interface SiteMenuItem {
  label: string;
  url?: string | null;
  sortOrder?: number;
}

export interface SiteMenu {
  name: string;
  location?: string;
  items?: SiteMenuItem[];
}

export interface SiteMedia {
  sourceUrl: string;
  fileName?: string | null;
  entityType?: string | null;
}

export interface SiteProject {
  slug?: string;
  title: string;
  tag?: string | null;
  summary?: string | null;
  description?: unknown;
  heroImageUrl?: string | null;
  cardImageUrl?: string | null;
  featured?: boolean;
}

export interface SiteTeamMember {
  name: string;
  role?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
}

export interface SiteTestimonial {
  quote: string;
  name: string;
  role?: string | null;
  avatarUrl?: string | null;
}

export interface SiteBlog {
  slug?: string;
  title: string;
  excerpt?: string | null;
  content?: unknown;
  coverImageUrl?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
}

export interface SiteEvent {
  slug?: string;
  title: string;
  description?: unknown;
  imageUrl?: string | null;
  location?: string | null;
  startDate?: string | null;
}

export interface SiteGalleryItem {
  imageUrl: string;
  altText?: string | null;
  caption?: string | null;
}

export interface SiteGallery {
  slug?: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  items?: SiteGalleryItem[];
}

export interface SiteEntities {
  projects?: SiteProject[];
  team?: SiteTeamMember[];
  testimonials?: SiteTestimonial[];
  blogs?: SiteBlog[];
  events?: SiteEvent[];
  galleries?: SiteGallery[];
}

export interface SiteModel {
  meta?: {
    source?: string;
    sourceType?: string;
    extractedAt?: string;
    [key: string]: unknown;
  };
  settings?: SiteSettings;
  pages?: SitePage[];
  menus?: SiteMenu[];
  media?: SiteMedia[];
  entities?: SiteEntities;
}

export interface AnalyzerOptions {
  maxPages?: number;
  /** Filter for which links to follow (e.g. start of path). */
  includePath?: string;
}
