import type { Request } from 'express';
import { randomBytes } from 'node:crypto';
import { PublishStatus } from '@prisma/client';
import { prisma } from '../../../libs/prisma';
import { ApiError } from '../../../utils/ApiError';
import { recordAudit } from '../../../utils/audit';
import { mediaService } from '../../media/service';
import { websiteRepository } from './repository';
import { getDefaultSections, genericDefaultSections } from './defaults';
import { siteCache } from '../site/cache';
import type {
  DraftSectionInput,
  PatchSectionInput,
  PutSectionInput,
} from './schema';

const PREVIEW_KEY_SETTING = 'site.previewKey';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|avif|bmp)(\?.*)?$/i;

function isImageUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value) && IMAGE_EXT.test(value);
}

export function inferFieldType(value: unknown): string {
  const v: any = value;
  if (Array.isArray(v)) {
    return v.length > 0 && typeof v[0] === 'object' && v[0] !== null ? 'repeater' : 'list';
  }
  if (v === null || v === undefined) return 'text';
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'object') return 'group';
  if (typeof v === 'string') {
    if (/^https?:\/\//i.test(v) && IMAGE_EXT.test(v)) return 'image';
    if (/^https?:\/\/.+/i.test(v)) return 'url';
    return v.length > 160 ? 'textarea' : 'text';
  }
  return 'text';
}

interface TemplateFieldLike {
  name: string;
  label?: string;
  type?: string;
  default?: unknown;
}

function buildFields(
  content: Record<string, unknown>,
  template?: { fields?: unknown } | null,
): Array<{
  name: string;
  label: string;
  type: string;
  value: unknown;
  imageUrl: string | null;
  displayOrder: number;
  def?: unknown;
}> {
  const defs = (template?.fields as TemplateFieldLike[] | undefined) ?? [];
  const defByName = new Map(defs.map((f) => [f.name, f]));
  const orderedNames = [
    ...defs.map((f) => f.name),
    ...Object.keys(content).filter((k) => !defByName.has(k)),
  ];
  const names = orderedNames.length > 0 ? orderedNames : Object.keys(content);

  return names.map((name, index) => {
    const def = defByName.get(name);
    const value = content[name] ?? def?.default ?? null;
    const type = def?.type ?? inferFieldType(content[name]);
    return {
      name,
      label: def?.label ?? name,
      type,
      value,
      imageUrl: isImageUrl(value) ? value : null,
      displayOrder: index + 1,
      def: def ?? null,
    };
  });
}

function toSectionDto(
  section: {
    id: string;
    type: string;
    name: string | null;
    sortOrder: number;
    isActive: boolean;
    settings: unknown;
    content: unknown;
    draftName?: string | null;
    draftIsActive?: boolean | null;
    draftSettings?: unknown;
    draftContent?: unknown;
    createdAt: Date;
    updatedAt: Date;
  },
  template?: { fields?: unknown } | null,
) {
  const content = (section.content as Record<string, unknown> | null) ?? {};
  const hasChanges =
    section.draftContent != null ||
    section.draftSettings != null ||
    section.draftName != null ||
    section.draftIsActive != null;
  return {
    id: section.id,
    component: section.type,
    sectionName: section.name,
    displayOrder: section.sortOrder,
    status: section.isActive ? 'ACTIVE' : 'INACTIVE',
    settings: section.settings,
    content,
    fields: buildFields(content, template),
    hasChanges,
    draftName: section.draftName ?? null,
    draftIsActive: section.draftIsActive ?? null,
    draftSettings: (section.draftSettings as Record<string, unknown> | null) ?? null,
    draftContent: (section.draftContent as Record<string, unknown> | null) ?? null,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}

function toPageDto(page: {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  keywords: unknown;
  status: string;
  template: string;
  sortOrder: number;
  isHome: boolean;
  createdAt: Date;
  updatedAt: Date;
  sections: Array<{
    id: string;
    type: string;
    name: string | null;
    sortOrder: number;
    isActive: boolean;
    settings: unknown;
    content: unknown;
    createdAt: Date;
    updatedAt: Date;
  }>;
}, templates: Map<string, { fields?: unknown }>) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImageUrl: page.ogImageUrl,
    canonicalUrl: page.canonicalUrl,
    robots: page.robots,
    keywords: page.keywords,
    status: page.status,
    template: page.template,
    sortOrder: page.sortOrder,
    isHome: page.isHome,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    sections: page.sections.map((s) => toSectionDto(s, templates.get(s.type))),
  };
}

async function loadTemplates(organizationId: string) {
  const templates = await websiteRepository.listTemplatesForOrg(organizationId);
  return new Map(templates.map((t) => [t.type, t as { fields?: unknown }]));
}

async function requirePage(organizationId: string, pageSlug: string) {
  const page = await websiteRepository.getPageBySlug(organizationId, pageSlug);
  if (!page) throw ApiError.notFound(`Page not found: ${pageSlug}`);
  return page;
}

/**
 * Auto-provisions editable sections for a page that has none, using the
 * seeded blueprint (or a generic fallback) so the editor is never empty.
 * Returns the number of sections created (0 when the page already has some).
 */
async function provisionDefaults(
  organizationId: string,
  page: { id: string; slug: string; sections: unknown[] },
): Promise<number> {
  if (page.sections.length > 0) return 0;
  const defaults = getDefaultSections(page.slug) ?? genericDefaultSections();
  return websiteRepository.createDefaultSections(page.id, organizationId, defaults);
}

function mergedContent(
  existing: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...existing };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      out[key] &&
      typeof out[key] === 'object' &&
      !Array.isArray(out[key])
    ) {
      out[key] = { ...(out[key] as Record<string, unknown>), ...(value as Record<string, unknown>) };
    } else {
      out[key] = value;
    }
  }
  return out;
}

export const websiteService = {
  async getWebsite(slug: string) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const settings = await websiteRepository.getSettings(org.id);
    return {
      website: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        email: org.email,
        phone: org.phone,
        website: org.website,
        address: org.address,
        city: org.city,
        state: org.state,
        country: org.country,
        logoUrl: org.logoUrl,
        status: org.status,
        updatedAt: org.updatedAt,
      },
      settings,
    };
  },

  async getContentTree(slug: string) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    let pages = await websiteRepository.getPages(org.id);
    const emptyPages = pages.filter((p) => p.sections.length === 0);
    if (emptyPages.length > 0) {
      for (const page of emptyPages) {
        await provisionDefaults(org.id, page);
      }
      pages = await websiteRepository.getPages(org.id);
    }
    const [settings, templates] = await Promise.all([
      websiteRepository.getSettings(org.id),
      loadTemplates(org.id),
    ]);
    return {
      website: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        logoUrl: org.logoUrl,
        status: org.status,
        updatedAt: org.updatedAt,
      },
      settings,
      pages: pages.map((p) => toPageDto(p, templates)),
    };
  },

  async getPage(slug: string, pageSlug: string) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const [page, templates] = await Promise.all([
      websiteRepository.getPageBySlug(org.id, pageSlug),
      loadTemplates(org.id),
    ]);
    if (!page) throw ApiError.notFound('Page not found');
    const created = await provisionDefaults(org.id, page);
    if (created > 0) {
      const refetched = await websiteRepository.getPageBySlug(org.id, pageSlug);
      if (refetched) return toPageDto(refetched, templates);
    }
    return toPageDto(page, templates);
  },

  async getSection(slug: string, pageSlug: string, sectionType: string) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);
    await provisionDefaults(org.id, page);
    const section = await websiteRepository.findSectionByType(page.id, sectionType);
    if (!section) throw ApiError.notFound(`Section not found: ${sectionType}`);
    const templates = await loadTemplates(org.id);
    return toSectionDto(section, templates.get(sectionType));
  },

  async upsertSection(
    slug: string,
    pageSlug: string,
    sectionType: string,
    input: PutSectionInput,
    req: Request,
  ) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);

    const existing = await websiteRepository.findSectionByType(page.id, sectionType);

    let section;
    if (existing) {
      section = await websiteRepository.updateSection(existing.id, {
        name: input.name === undefined ? undefined : input.name,
        isActive: input.isActive,
        settings: input.settings === undefined ? undefined : input.settings,
        content: input.content,
      });
    } else {
      const maxOrder = page.sections.reduce((max, s) => Math.max(max, s.sortOrder), 0);
      section = await websiteRepository.createSection({
        pageId: page.id,
        organizationId: org.id,
        type: sectionType,
        name: input.name ?? null,
        sortOrder: maxOrder + 1,
        isActive: input.isActive ?? true,
        settings: input.settings ?? undefined,
        content: input.content,
      });
    }

    await websiteRepository.setPagePublished(org.id, page.id);
    siteCache.invalidate(slug);

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: existing ? 'UPDATE' : 'CREATE',
      resource: 'section',
      resourceId: section.id,
      message: `Section ${existing ? 'updated' : 'created'}: ${sectionType} on /${pageSlug} (auto-published)`,
      req,
    });

    const templates = await loadTemplates(org.id);
    return toSectionDto(section, templates.get(sectionType));
  },

  async patchSection(
    slug: string,
    pageSlug: string,
    sectionType: string,
    input: PatchSectionInput,
    req: Request,
  ) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);

    const existing = await websiteRepository.findSectionByType(page.id, sectionType);
    if (!existing) throw ApiError.notFound(`Section not found: ${sectionType}`);

    const content =
      input.content === undefined
        ? undefined
        : mergedContent((existing.content as Record<string, unknown>) ?? {}, input.content);

    const section = await websiteRepository.updateSection(existing.id, {
      name: input.name === undefined ? undefined : input.name,
      isActive: input.isActive,
      settings: input.settings === undefined ? undefined : input.settings,
      content,
    });

    await websiteRepository.setPagePublished(org.id, page.id);
    siteCache.invalidate(slug);

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'UPDATE',
      resource: 'section',
      resourceId: section.id,
      message: `Section updated: ${sectionType} on /${pageSlug} (auto-published)`,
      req,
    });

    const templates = await loadTemplates(org.id);
    return toSectionDto(section, templates.get(sectionType));
  },

  async removeSection(slug: string, pageSlug: string, sectionType: string, req: Request) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);
    const section = await websiteRepository.findSectionByType(page.id, sectionType);
    if (!section) throw ApiError.notFound(`Section not found: ${sectionType}`);

    await websiteRepository.deleteSection(section.id);
    siteCache.invalidate(slug);

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'DELETE',
      resource: 'section',
      resourceId: section.id,
      message: `Section deleted: ${sectionType} on /${pageSlug}`,
      req,
    });

    return true;
  },

  async reorderSections(slug: string, pageSlug: string, order: string[], req: Request) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);

    const typesOnPage = new Set(page.sections.map((section) => section.type));
    const unknown = order.filter((type) => !typesOnPage.has(type));
    if (unknown.length > 0) {
      throw ApiError.badRequest(`Unknown section types: ${unknown.join(', ')}`);
    }

    await websiteRepository.reorderSectionsByType(page.id, order);
    await websiteRepository.setPagePublished(org.id, page.id);
    siteCache.invalidate(slug);

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'UPDATE',
      resource: 'page',
      resourceId: page.id,
      message: `Section order updated on /${pageSlug} (auto-published)`,
      req,
    });

    return true;
  },

  async publish(slug: string, req: Request) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const result = await websiteRepository.publishAll(org.id, PublishStatus.PUBLISHED);
    siteCache.invalidate(slug);

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'PUBLISH',
      resource: 'website',
      resourceId: org.id,
      message: `Website published: ${result.count} page(s) made live`,
      req,
    });

    return { published: result.count };
  },

  async saveSectionDraft(
    slug: string,
    pageSlug: string,
    sectionType: string,
    input: DraftSectionInput,
    req: Request,
  ) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);
    const existing = await websiteRepository.findSectionByType(page.id, sectionType);
    if (!existing) throw ApiError.notFound(`Section not found: ${sectionType}`);

    const section = await websiteRepository.saveSectionDraft(existing.id, {
      name: input.name === undefined ? undefined : input.name,
      isActive: input.isActive === undefined ? undefined : input.isActive,
      settings: input.settings === undefined ? undefined : input.settings,
      content: input.content ?? {},
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'UPDATE',
      resource: 'section',
      resourceId: section.id,
      message: `Draft saved for ${sectionType} on /${pageSlug} (not live yet)`,
      req,
    });

    const templates = await loadTemplates(org.id);
    return toSectionDto(section, templates.get(sectionType));
  },

  async publishPage(slug: string, pageSlug: string, req: Request) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);

    let promoted = 0;
    for (const section of page.sections) {
      const hasDraft =
        section.draftContent != null ||
        section.draftSettings != null ||
        section.draftName != null ||
        section.draftIsActive != null;
      if (!hasDraft) continue;
      await websiteRepository.promoteSectionDraft(section.id, {
        name: section.draftName ?? section.name,
        isActive: section.draftIsActive ?? section.isActive,
        settings:
          (section.draftSettings as Record<string, unknown> | null) ??
          (section.settings as Record<string, unknown> | null) ??
          {},
        content:
          (section.draftContent as Record<string, unknown> | null) ??
          (section.content as Record<string, unknown> | null) ??
          {},
      });
      promoted += 1;
    }

    await websiteRepository.setPagePublished(org.id, page.id);
    siteCache.invalidate(slug);

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'PUBLISH',
      resource: 'page',
      resourceId: page.id,
      message: `Page /${pageSlug} published: ${promoted} drafted section(s) made live`,
      req,
    });

    return { published: promoted };
  },

  async discardPageDrafts(slug: string, pageSlug: string, req: Request) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    const page = await requirePage(org.id, pageSlug);

    let discarded = 0;
    for (const section of page.sections) {
      const hasDraft =
        section.draftContent != null ||
        section.draftSettings != null ||
        section.draftName != null ||
        section.draftIsActive != null;
      if (!hasDraft) continue;
      await websiteRepository.clearSectionDraft(section.id);
      discarded += 1;
    }

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'UPDATE',
      resource: 'page',
      resourceId: page.id,
      message: `Discarded ${discarded} drafted section(s) on /${pageSlug}`,
      req,
    });

    return { discarded };
  },

  async getPreviewLink(slug: string, req: Request) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');

    const settings = await websiteRepository.getSettings(org.id);
    let previewKey =
      typeof settings[PREVIEW_KEY_SETTING] === 'string'
        ? (settings[PREVIEW_KEY_SETTING] as string)
        : null;
    if (!previewKey || previewKey.length < 16) {
      previewKey = randomBytes(16).toString('hex');
      await websiteRepository.upsertSetting(org.id, PREVIEW_KEY_SETTING, previewKey);
    }

    const baseUrl =
      typeof org.website === 'string' && /^https?:\/\//i.test(org.website)
        ? org.website.replace(/\/+$/, '')
        : null;

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'UPDATE',
      resource: 'page',
      resourceId: org.id,
      message: `Preview link generated for ${org.slug}`,
      req,
    });

    return { baseUrl, previewKey };
  },

  async upload(
    slug: string,
    file: Express.Multer.File,
    meta: { entityType?: string; entityId?: string; folder?: string },
    userId: string,
  ) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    return mediaService.upload({ id: org.id, slug: org.slug }, file, meta, userId);
  },

  async removeMedia(slug: string, mediaId: string, userId: string) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');
    return mediaService.remove(org.id, mediaId, userId);
  },

  async getLiveImages(slug: string) {
    const org = await websiteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Website not found');

    const baseUrl = org.website?.startsWith('http') ? org.website : `https://${org.website || slug}.vercel.app`;
    
    try {
      // Get the homepage sections from database
      const pages = await prisma.page.findMany({
        where: { organizationId: org.id, isHome: true },
        include: { sections: { orderBy: { sortOrder: 'asc' } } },
      });

      const homePage = pages[0] || pages.find((p: { slug: string }) => p.slug === 'home') || pages[0];
      if (!homePage) return {};

      const images: Record<string, string> = {};
      const galleryImages: string[] = [];

      // Helper to make URL absolute
      const makeAbsolute = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return new URL(url, baseUrl).href;
        return new URL(url, baseUrl + '/').href;
      };

      // Helper to check if a string is an image URL
      const isImageUrl = (str: string) => 
        typeof str === 'string' && str.match(/\.(jpe?g|png|webp|gif|svg|avif|bmp)/i);

      // Extract images from homepage sections - generic approach
      for (const section of homePage.sections) {
        const content = (section.content as Record<string, unknown>) ?? {};
        
        // Check for single image field
        const singleImage = content.image as string;
        if (singleImage && isImageUrl(singleImage)) {
          const absUrl = makeAbsolute(singleImage);
          // First image becomes hero if not set
          if (!images.hero) images.hero = absUrl;
          // Second becomes about if not set
          else if (!images.about) images.about = absUrl;
          // Add to gallery pool
          galleryImages.push(absUrl);
        }

        // Check all fields for image arrays and nested objects
        for (const [, value] of Object.entries(content)) {
          if (Array.isArray(value)) {
            // Handle arrays of strings (e.g., gallery images)
            const imgArray = value.filter(v => isImageUrl(v as string)) as string[];
            if (imgArray.length > 0) {
              galleryImages.push(...imgArray.map(makeAbsolute));
            }
            // Handle arrays of objects with image fields (e.g., items with image property)
            for (const item of value) {
              if (item && typeof item === 'object') {
                const obj = item as Record<string, unknown>;
                for (const [, v] of Object.entries(obj)) {
                  if (isImageUrl(v as string)) {
                    galleryImages.push(makeAbsolute(v as string));
                  }
                }
              }
            }
          } else if (value && typeof value === 'object') {
            // Handle nested objects with image fields
            const obj = value as Record<string, unknown>;
            for (const [, v] of Object.entries(obj)) {
              if (isImageUrl(v as string)) {
                galleryImages.push(makeAbsolute(v as string));
              }
            }
          }
        }

        // Also check for explicit images array (partners section)
        const explicitImages = content.images as string[];
        if (Array.isArray(explicitImages) && explicitImages.length > 0) {
          galleryImages.push(...explicitImages.filter(isImageUrl).map(makeAbsolute));
        }

        // Check items array for testimonials with images
        const items = content.items as Array<Record<string, unknown>>;
        if (Array.isArray(items)) {
          for (const item of items) {
            if (item && typeof item === 'object') {
              const itemImage = item.image as string;
              if (isImageUrl(itemImage)) {
                galleryImages.push(makeAbsolute(itemImage));
              }
            }
          }
        }
      }

      // Deduplicate and assign
      const uniqueGallery = [...new Set(galleryImages.filter(Boolean))];
      
      // Assign first gallery image as hero if not set
      if (!images.hero && uniqueGallery.length > 0) images.hero = uniqueGallery[0];
      // Assign second as about if not set
      if (!images.about && uniqueGallery.length > 1) images.about = uniqueGallery[1];
      // Limit gallery to 6 images
      images.gallery = uniqueGallery.slice(0, 6).join(',');

      // Expose base URL so clients can absolutize relative image paths
      return { ...images, baseUrl };
    } catch {
      return {};
    }
  },
};
