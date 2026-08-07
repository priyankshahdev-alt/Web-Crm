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

    return input.orderedIds;
  },
};
