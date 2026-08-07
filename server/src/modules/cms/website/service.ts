import type { Request } from 'express';
import { PublishStatus } from '@prisma/client';
import { ApiError } from '../../../utils/ApiError';
import { recordAudit } from '../../../utils/audit';
import { mediaService } from '../../media/service';
import { websiteRepository } from './repository';
import { getDefaultSections, genericDefaultSections } from './defaults';
import type { PatchSectionInput, PutSectionInput } from './schema';

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
    createdAt: Date;
    updatedAt: Date;
  },
  template?: { fields?: unknown } | null,
) {
  const content = (section.content as Record<string, unknown> | null) ?? {};
  return {
    id: section.id,
    component: section.type,
    sectionName: section.name,
    displayOrder: section.sortOrder,
    status: section.isActive ? 'ACTIVE' : 'INACTIVE',
    settings: section.settings,
    content,
    fields: buildFields(content, template),
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

  async upload(
    slug: string,
    file: Express.Multer.File,
    meta: { entityType?: string; entityId?: string },
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
};
