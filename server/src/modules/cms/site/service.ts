import { ApiError } from '../../../utils/ApiError';
import { siteRepository } from './repository';
import { siteCache } from './cache';

function entityIds(content: Record<string, unknown> | null | undefined): string[] | undefined {
  const ids = content?.entityIds;
  if (Array.isArray(ids)) return ids.filter((id): id is string => typeof id === 'string');
  return undefined;
}

function showAll(content: Record<string, unknown> | null | undefined): boolean {
  return content?.showAll === true;
}

interface SectionDto {
  id: string;
  type: string;
  name: string | null;
  sortOrder: number;
  isActive: boolean;
  settings: unknown;
  content: unknown;
  entities?: unknown[];
}

export const siteService = {
  async getSiteBySlug(slug: string, options?: { previewKey?: string }) {
    const previewKey = typeof options?.previewKey === 'string' ? options.previewKey : '';
    const previewRequested = previewKey.length > 0;
    if (!previewRequested) {
      const cached = siteCache.get(slug);
      if (cached !== undefined) return cached;
    }

    const org = await siteRepository.findBySlug(slug);
    if (!org) throw ApiError.notFound('Organization not found');

    let draftPreview = false;
    if (previewRequested) {
      // Only serve drafts when the token matches; otherwise fall back to the
      // published view silently so stale links never break the public site.
      const settings = await siteRepository.getSettings(org.id);
      draftPreview = settings['site.previewKey'] === previewKey;
    }

    const [settings, menus, banners, sliders, pages, locations] = await Promise.all([
      siteRepository.getSettings(org.id),
      siteRepository.getMenus(org.id),
      siteRepository.getBanners(org.id),
      siteRepository.getSliders(org.id),
      draftPreview ? siteRepository.getPagesWithDrafts(org.id) : siteRepository.getPages(org.id),
      siteRepository.getLocations(org.id),
    ]);

    const pageTree = await Promise.all(
      pages.map(async (page) => {
        const sections = await Promise.all(
          page.sections.map(async (section) => {
            const isActive = draftPreview
              ? (section.draftIsActive ?? section.isActive)
              : section.isActive;
            if (draftPreview && !isActive) return null;
            const content = (
              draftPreview
                ? ((section.draftContent ?? section.content) as Record<string, unknown> | null)
                : (section.content as Record<string, unknown> | null)
            ) ?? {};
            const dto: SectionDto = {
              id: section.id,
              type: section.type,
              name: draftPreview ? (section.draftName ?? section.name) : section.name,
              sortOrder: section.sortOrder,
              isActive,
              settings: draftPreview ? (section.draftSettings ?? section.settings) : section.settings,
              content: draftPreview ? (section.draftContent ?? section.content) : section.content,
            };
            dto.entities = await this.resolveEntities(org.id, section.type, content);
            return dto;
          }),
        );
        return {
          id: page.id,
          slug: page.slug,
          title: page.title,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          template: page.template,
          isHome: page.isHome,
          sections: sections.filter((s): s is SectionDto => s !== null),
        };
      }),
    );

    const result = {
      organization: org,
      settings,
      menus,
      banners,
      sliders,
      locations,
      pages: pageTree,
    };

    if (!previewRequested) {
      siteCache.set(slug, result);
    }
    return result;
  },

  async resolveEntities(
    organizationId: string,
    type: string,
    content: Record<string, unknown>,
  ): Promise<unknown[] | undefined> {
    const ids = entityIds(content);
    const all = showAll(content);

    switch (type) {
      case 'projects-grid':
        return siteRepository.getProjectsByIds(organizationId, ids, all);
      case 'campaigns':
        return siteRepository.getCampaignsByIds(organizationId, ids, all);
      case 'team':
        return siteRepository.getTeamMembersByIds(organizationId, ids, all);
      case 'partners':
        return siteRepository.getPartnersByIds(organizationId, ids, all);
      case 'faq':
        return siteRepository.getFaqsByIds(organizationId, ids, all);
      case 'awards':
        return siteRepository.getAwardsByIds(organizationId, ids, all);
      case 'stories':
        return siteRepository.getBlogsByIds(organizationId, ids, all);
      case 'gallery': {
        const gallery = await siteRepository.getGalleryById(
          organizationId,
          typeof content.galleryId === 'string' ? content.galleryId : undefined,
        );
        return gallery ? [gallery] : [];
      }
      case 'documents': {
        const docs = await siteRepository.getDocumentsByCategory(
          organizationId,
          typeof content.categoryId === 'string' ? content.categoryId : undefined,
        );
        return docs;
      }
      default:
        return undefined;
    }
  },
};
