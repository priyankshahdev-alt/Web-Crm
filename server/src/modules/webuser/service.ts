import type { Request } from 'express';
import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/audit';
import { getSectionTypeDefinition, validateSectionContent } from '../../sections';
import {
  defaultContentFromFields,
  zodFromFields,
  type FieldDef,
} from '../../utils/sectionFields';
import { sectionTemplateRepository } from '../cms/section-template/repository';
import { sectionTemplateService } from '../cms/section-template/service';
import { siteRepository } from '../cms/site/repository';
import { siteCache } from '../cms/site/cache';
import { mediaService } from '../media/service';
import { webUserRepository } from './repository';
import type { UpdateWebsiteSectionInput } from './schema';

export const webUserService = {
  async getWebsite(websiteId: string) {
    const org = await webUserRepository.getWebsite(websiteId);
    if (!org) throw ApiError.notFound('Website not found');

    const [settings, menus, banners, sliders, page] = await Promise.all([
      siteRepository.getSettings(websiteId),
      siteRepository.getMenus(websiteId),
      siteRepository.getBanners(websiteId),
      siteRepository.getSliders(websiteId),
      webUserRepository.getHomePage(websiteId),
    ]);

    if (!page) throw ApiError.notFound('Home page not found for this website');

    const templates = await sectionTemplateRepository.listTemplatesForOrg(websiteId);
    const byType = new Map(templates.map((t) => [t.type, t]));

    const sections = page.sections.map((s) => {
      const template = byType.get(s.type);
      return {
        id: s.id,
        type: s.type,
        name: s.name,
        sortOrder: s.sortOrder,
        isActive: s.isActive,
        settings: s.settings,
        content: s.content,
        template: template
          ? {
              id: template.id,
              type: template.type,
              name: template.name,
              label: template.label,
              isSystem: template.isSystem,
              fields: template.fields,
            }
          : null,
      };
    });

    return {
      website: org,
      settings,
      menus,
      banners,
      sliders,
      liveUrl: org.website || `/${org.slug}`,
      page: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        status: page.status,
        isHome: page.isHome,
        sections,
      },
    };
  },

  async updateSection(
    websiteId: string,
    sectionId: string,
    input: UpdateWebsiteSectionInput,
    req: Request,
  ) {
    const existing = await webUserRepository.findSection(sectionId, websiteId);
    if (!existing) throw ApiError.notFound('Section not found');

    const type = existing.type;

    let content: unknown = input.content;
    if (input.content !== undefined) {
      const template = await sectionTemplateService.resolveForType(websiteId, type);
      if (!template) throw ApiError.badRequest(`Unknown section type: ${type}`);
      if (template.isSystem) {
        getSectionTypeDefinition(type);
        validateSectionContent(type, input.content);
      } else {
        const schema = zodFromFields(template.fields as unknown as FieldDef[]);
        const candidate = input.content ?? defaultContentFromFields(template.fields as unknown as FieldDef[]);
        const parsed = schema.safeParse(candidate);
        if (!parsed.success) {
          throw ApiError.validation(
            `Invalid content for section type "${type}"`,
            parsed.error.issues,
          );
        }
        content = parsed.data;
      }
    }

    const section = await webUserRepository.updateSection(sectionId, {
      name: input.name === undefined ? undefined : input.name,
      isActive: input.isActive,
      settings: (input.settings as never) ?? undefined,
      content: content === undefined ? undefined : (content as never),
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId: websiteId,
      action: 'UPDATE',
      resource: 'section',
      resourceId: sectionId,
      message: `Website section updated: ${type}`,
      req,
    });

    const org = await webUserRepository.getWebsite(websiteId);
    if (org?.slug) siteCache.invalidate(org.slug);

    return section;
  },

  async uploadMedia(
    websiteId: string,
    file: Express.Multer.File,
    meta: { entityType?: string; entityId?: string },
    userId: string,
  ) {
    const org = await webUserRepository.getWebsite(websiteId);
    if (!org) throw ApiError.notFound('Website not found');
    return mediaService.upload(org, file, meta, userId);
  },
};
