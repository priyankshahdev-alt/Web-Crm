import type { Request } from 'express';
import { ApiError } from '../../../utils/ApiError';
import { recordAudit } from '../../../utils/audit';
import { buildPaginated, type Paginated } from '../../../utils/pagination';
import {
  getSectionTypeDefinition,
  validateSectionContent,
} from '../../../sections';
import {
  defaultContentFromFields,
  zodFromFields,
  type FieldDef,
} from '../../../utils/sectionFields';
import { sectionTemplateService } from '../section-template/service';
import { sectionTemplateRepository } from '../section-template/repository';
import { siteCache } from '../site/cache';
import { organizationRepository } from '../../../modules/organization/repository';
import { pageRepository, type ListParams } from './repository';
import type {
  CreatePageInput,
  CreateSectionInput,
  ReorderSectionsInput,
  UpdatePageInput,
  UpdateSectionInput,
} from './schema';

function ensureOwnedPage<T extends { id: string; organizationId: string }>(
  page: T | null,
  organizationId: string,
): T {
  if (!page || page.organizationId !== organizationId) {
    throw ApiError.notFound('Page not found');
  }
  return page;
}

async function invalidateSiteCache(organizationId: string) {
  const org = await organizationRepository.findById(organizationId);
  if (org?.slug) {
    siteCache.invalidate(org.slug);
  }
}

const DEFAULT_PAGE_LAYOUTS: Record<string, Array<{ type: string; name: string; sortOrder: number; content: Record<string, unknown> }>> = {
  home: [
    { type: 'hero', name: 'Hero', sortOrder: 1, content: { badge: 'Welcome', heading: 'Making a Difference, Together', subheading: 'Working across education, healthcare, livelihood and community welfare to empower those in need.', primaryCta: { label: 'Donate Now', url: '/donate' }, secondaryCta: { label: 'Our Work', url: '/projects' }, imageUrl: '', mobileImageUrl: '', altText: 'Hero banner' } },
    { type: 'about', name: 'About Intro', sortOrder: 2, content: { tag: 'Who We Are', heading: 'A foundation for the community', paragraphs: ['We are a non-profit committed to bringing meaningful change across all sections of society, from children to the elderly.'], imageUrl: '', imageAlt: 'About us', cta: { label: 'Learn More', url: '/about' } } },
    { type: 'stats', name: 'Impact Stats', sortOrder: 3, content: { heading: 'Our Impact', items: [{ value: '15k+', label: 'Lives Impacted' }, { value: '7', label: 'Sectors of Work' }, { value: '10+', label: 'Years of Service' }] } },
    { type: 'projects-grid', name: 'Our Projects', sortOrder: 4, content: { heading: 'Our Projects', subheading: 'Explore how we are transforming lives.', showAll: true, cta: { label: 'View All Projects', url: '/projects' } } },
    { type: 'cta', name: 'Join Us CTA', sortOrder: 5, content: { heading: 'Want to make a difference?', paragraph: 'Volunteer with us or contribute to our causes today.', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  page: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'about', name: 'About', sortOrder: 2, content: { tag: '', heading: '', paragraphs: [''], imageUrl: '', imageAlt: '', cta: { label: 'Learn More', url: '/about' } } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  default: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'about', name: 'About', sortOrder: 2, content: { tag: '', heading: '', paragraphs: [''], imageUrl: '', imageAlt: '', cta: { label: 'Learn More', url: '/about' } } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  blog: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'stories', name: 'Blog Listing', sortOrder: 2, content: { heading: 'Latest Posts', entityIds: [], showAll: true } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  gallery: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'gallery', name: 'Gallery', sortOrder: 2, content: { heading: 'Moments That Matter', layout: 'grid' } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  contact: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'contact-info', name: 'Contact Info', sortOrder: 2, content: { heading: 'Get in Touch', items: [{ icon: 'map-marker-alt', label: 'Address', value: '', type: 'address' }, { icon: 'phone', label: 'Phone', value: '', type: 'phone' }, { icon: 'envelope', label: 'Email', value: '', type: 'email' }] } },
    { type: 'form', name: 'Contact Form', sortOrder: 3, content: { heading: 'Send us a message', formType: 'contact', submitLabel: 'Send Message', successMessage: 'Thank you! We will get back to you soon.' } },
    { type: 'map', name: 'Map', sortOrder: 4, content: { heading: 'Find Us' } },
  ],
  donate: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'donate', name: 'Donate', sortOrder: 2, content: { heading: 'Make a Donation', subheading: 'Your support makes our work possible.', causes: [], amounts: [100, 500, 1000, 5000], payment: {} } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  faq: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'faq', name: 'FAQ', sortOrder: 2, content: { heading: 'Frequently Asked Questions', entityIds: [], showAll: true } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  documents: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'documents', name: 'Documents', sortOrder: 2, content: { heading: 'Reports & Documents' } },
    { type: 'cta', name: 'Call to Action', sortOrder: 3, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
  about: [
    { type: 'page-hero', name: 'Page Hero', sortOrder: 1, content: { heading: '', subheading: '', imageUrl: '', mobileImageUrl: '', altText: '' } },
    { type: 'story', name: 'Our Story', sortOrder: 2, content: { tag: 'Our Story', heading: 'How we started', paragraphs: ['We began with a small team and a big dream.'] } },
    { type: 'mission-vision', name: 'Mission & Vision', sortOrder: 3, content: { mission: { title: 'Our Mission', description: 'To create a just, equitable and humane society through holistic interventions.' }, vision: { title: 'Our Vision', description: 'To build a self-reliant society where every individual has access to basic necessities and opportunities.' } } },
    { type: 'values', name: 'Our Values', sortOrder: 4, content: { heading: 'Our Values', items: [{ icon: '', title: 'Compassion', description: '' }, { icon: '', title: 'Integrity', description: '' }, { icon: '', title: 'Impact', description: '' }] } },
    { type: 'team', name: 'Our Team', sortOrder: 5, content: { heading: 'Our Team', showAll: true } },
    { type: 'cta', name: 'Call to Action', sortOrder: 6, content: { heading: '', paragraph: '', buttonLabel: 'Get Involved', buttonUrl: '/contact' } },
  ],
};

function buildDefaultSectionsForTemplate(template: string): Array<{ type: string; name: string; sortOrder: number; content: Record<string, unknown> }> {
  const layout = DEFAULT_PAGE_LAYOUTS[template] ?? DEFAULT_PAGE_LAYOUTS.default;
  return layout.map((section) => ({
    type: section.type,
    name: section.name,
    sortOrder: section.sortOrder,
    isActive: true,
    content: section.content,
    settings: undefined,
  }));
}

export const pageService = {
  async list(params: ListParams): Promise<Paginated<unknown>> {
    const { items, total } = await pageRepository.list(params);
    return buildPaginated(items, total, Math.floor(params.skip / params.take) + 1, params.take);
  },

  async getById(organizationId: string, id: string) {
    const page = await pageRepository.findByIdInOrg(id, organizationId);
    if (!page) throw ApiError.notFound('Page not found');

    const templates = await sectionTemplateRepository.listTemplatesForOrg(organizationId);
    const byType = new Map(templates.map((t) => [t.type, t]));
    const sections = page.sections.map((s) => {
      const template = byType.get(s.type);
      if (!template) return s;
      return {
        ...s,
        template: {
          id: template.id,
          type: template.type,
          name: template.name,
          label: template.label,
          isSystem: template.isSystem,
          fields: template.fields,
        },
      };
    });

    return { ...page, sections };
  },

  async create(organizationId: string, input: CreatePageInput, req: Request) {
    const slugConflict = await pageRepository.findBySlugInOrg(input.slug, organizationId);
    if (slugConflict) throw ApiError.conflict('A page with this slug already exists', 'slug');

    const page = await pageRepository.create({
      organizationId,
      slug: input.slug,
      title: input.title,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      status: input.status ?? 'DRAFT',
      template: input.template ?? 'default',
      sortOrder: input.sortOrder ?? 0,
      isHome: input.isHome ?? false,
    });

    if (input.sections && input.sections.length > 0) {
      await pageRepository.replaceSections(
        page.id,
        organizationId,
        input.sections,
      );
    } else {
      const defaultSections = buildDefaultSectionsForTemplate(input.template ?? 'default');
      if (defaultSections.length > 0) {
        await pageRepository.replaceSections(page.id, organizationId, defaultSections);
      }
    }

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'CREATE',
      resource: 'page',
      resourceId: page.id,
      message: `Page created: ${page.title}`,
      req,
    });

    await invalidateSiteCache(organizationId);

    return page;
  },

  async update(organizationId: string, id: string, input: UpdatePageInput, req: Request) {
    const existing = ensureOwnedPage(
      await pageRepository.findByIdInOrg(id, organizationId),
      organizationId,
    );

    if (input.slug) {
      const conflict = await pageRepository.findBySlugInOrg(input.slug, organizationId);
      if (conflict && conflict.id !== id) {
        throw ApiError.conflict('A page with this slug already exists', 'slug');
      }
    }

    const { sections, ...pagePatch } = input;
    const hasStatusChange = pagePatch.status !== undefined && pagePatch.status !== existing.status;

    if (sections) {
      await pageRepository.replaceSections(id, organizationId, sections);

      await recordAudit({
        userId: req.user?.id,
        organizationId,
        action: 'UPDATE',
        resource: 'page',
        resourceId: id,
        message: `Page sections updated: ${existing.title}`,
        req,
      });
    }

    if (Object.keys(pagePatch).length > 0) {
      await pageRepository.update(id, { ...pagePatch });

      await recordAudit({
        userId: req.user?.id,
        organizationId,
        action: 'UPDATE',
        resource: 'page',
        resourceId: id,
        message: `Page updated: ${existing.title}`,
        req,
      });
    }

    const page = await pageRepository.findByIdInOrg(id, organizationId);
    if (!page) throw ApiError.notFound('Page not found');

    if (sections || hasStatusChange) {
      await invalidateSiteCache(organizationId);
    }

    return page;
  },

  async remove(organizationId: string, id: string, req: Request) {
    const existing = await pageRepository.findByIdInOrg(id, organizationId);
    const page = ensureOwnedPage(existing, organizationId);
    if (page.isHome) throw ApiError.forbidden('Cannot delete the home page');

    await pageRepository.delete(id);

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'DELETE',
      resource: 'page',
      resourceId: id,
      message: `Page deleted: ${page.title}`,
      req,
    });

    await invalidateSiteCache(organizationId);

    return true;
  },

  async addSection(organizationId: string, pageId: string, input: CreateSectionInput, req: Request) {
    const found = await pageRepository.findByIdInOrg(pageId, organizationId);
    const page = ensureOwnedPage(found, organizationId);

    const template = await sectionTemplateService.resolveForType(organizationId, input.type);
    if (!template) {
      throw ApiError.badRequest(`Unknown section type: ${input.type}`);
    }

    let content: unknown = input.content ?? undefined;
    if (template.isSystem) {
      getSectionTypeDefinition(input.type);
      if (content !== undefined) {
        validateSectionContent(input.type, content);
      }
    } else {
      const schema = zodFromFields(template.fields as unknown as FieldDef[]);
      const candidate = content ?? defaultContentFromFields(template.fields as unknown as FieldDef[]);
      const parsed = schema.safeParse(candidate);
      if (!parsed.success) {
        throw ApiError.validation(
          `Invalid content for section type "${input.type}"`,
          parsed.error.issues,
        );
      }
      content = parsed.data;
    }

    const maxOrder = page.sections.reduce((max, s) => Math.max(max, s.sortOrder), 0) ?? 0;

    const section = await pageRepository.createSection({
      pageId,
      organizationId,
      type: input.type,
      name: input.name ?? null,
      sortOrder: input.sortOrder ?? maxOrder + 1,
      isActive: input.isActive ?? true,
      settings: (input.settings as never) ?? undefined,
      content: (content as never) ?? undefined,
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'CREATE',
      resource: 'section',
      resourceId: section.id,
      message: `Section added: ${input.type} on page ${page.title}`,
      req,
    });

    await invalidateSiteCache(organizationId);

    return section;
  },

  async updateSection(
    organizationId: string,
    pageId: string,
    sectionId: string,
    input: UpdateSectionInput,
    req: Request,
  ) {
    const page = await pageRepository.findByIdInOrg(pageId, organizationId);
    ensureOwnedPage(page, organizationId);

    const existing = await pageRepository.findSection(sectionId, organizationId);
    if (!existing || existing.pageId !== pageId) {
      throw ApiError.notFound('Section not found on this page');
    }

    const type = input.type ?? existing.type;
    const template = await sectionTemplateService.resolveForType(organizationId, type);
    if (!template) {
      throw ApiError.badRequest(`Unknown section type: ${type}`);
    }

    let content: unknown = input.content;
    if (input.content !== undefined) {
      if (template.isSystem) {
        getSectionTypeDefinition(type);
        validateSectionContent(type, input.content);
      } else {
        const schema = zodFromFields(template.fields as unknown as FieldDef[]);
        const parsed = schema.safeParse(input.content);
        if (!parsed.success) {
          throw ApiError.validation(
            `Invalid content for section type "${type}"`,
            parsed.error.issues,
          );
        }
        content = parsed.data;
      }
    }

    const section = await pageRepository.updateSection(sectionId, {
      type: input.type,
      name: input.name === undefined ? undefined : input.name,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
      settings: (input.settings as never) ?? undefined,
      content: content === undefined ? undefined : (content as never),
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'UPDATE',
      resource: 'section',
      resourceId: sectionId,
      message: `Section updated: ${type}`,
      req,
    });

    await invalidateSiteCache(organizationId);

    return section;
  },

  async removeSection(
    organizationId: string,
    pageId: string,
    sectionId: string,
    req: Request,
  ) {
    const page = await pageRepository.findByIdInOrg(pageId, organizationId);
    ensureOwnedPage(page, organizationId);

    const existing = await pageRepository.findSection(sectionId, organizationId);
    if (!existing || existing.pageId !== pageId) {
      throw ApiError.notFound('Section not found on this page');
    }

    await pageRepository.deleteSection(sectionId);

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'DELETE',
      resource: 'section',
      resourceId: sectionId,
      message: `Section deleted: ${existing.type}`,
      req,
    });

    await invalidateSiteCache(organizationId);

    return true;
  },

  async reorderSections(
    organizationId: string,
    pageId: string,
    input: ReorderSectionsInput,
    req: Request,
  ) {
    const found = await pageRepository.findByIdInOrg(pageId, organizationId);
    const page = ensureOwnedPage(found, organizationId);

    const sectionIds = page.sections.map((s) => s.id);
    const allPresent = input.orderedIds.every((id) => sectionIds.includes(id));
    if (!allPresent || input.orderedIds.length !== sectionIds.length) {
      throw ApiError.badRequest('orderedIds must contain exactly the page section ids');
    }

    await pageRepository.updateSectionOrder(organizationId, input.orderedIds);

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'UPDATE',
      resource: 'page',
      resourceId: pageId,
      message: 'Section order updated',
      req,
    });

    await invalidateSiteCache(organizationId);

    return input.orderedIds;
  },
};