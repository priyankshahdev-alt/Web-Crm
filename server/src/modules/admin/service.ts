import type { Request } from 'express';
import { ApiError } from '../../utils/ApiError';
import { webUserService } from '../webuser/service';
import type { UpdateWebsiteSectionInput } from '../webuser/schema';
import { adminRepository } from './repository';

export const adminService = {
  /**
   * List every website with live counts across the platform.
   * Admins are not scoped to a single website, so this returns all orgs.
   */
  async listWebsites() {
    const [websites, publishedPagesPerOrg] = await Promise.all([
      adminRepository.listWebsites(),
      adminRepository.publishedPagesPerOrg(),
    ]);

    return websites.map((website) => {
      const { _count, ...org } = website;
      return {
        ...org,
        counts: {
          users: _count.users,
          projects: _count.projects,
          pages: _count.pages,
          media: _count.media,
        },
        publishedPages: publishedPagesPerOrg.get(website.id) ?? 0,
        isPublished: website.status === 'ACTIVE',
      };
    });
  },

  /**
   * Full editable content for a single website (any websiteId — admins are
   * not restricted to the website encoded in a web-user JWT).
   */
  async getWebsite(websiteId: string) {
    const org = await adminRepository.getWebsite(websiteId);
    if (!org) throw ApiError.notFound('Website not found');
    return webUserService.getWebsite(websiteId);
  },

  /**
   * Update any section of any website, publishing immediately (reuses the
   * web-user section-update logic verbatim).
   */
  updateSection(
    websiteId: string,
    sectionId: string,
    input: UpdateWebsiteSectionInput,
    req: Request,
  ) {
    return webUserService.updateSection(websiteId, sectionId, input, req);
  },

  /**
   * Upload media into any website (reuses the web-user upload logic).
   */
  uploadMedia(
    websiteId: string,
    file: Express.Multer.File,
    meta: { entityType?: string; entityId?: string },
    userId: string,
  ) {
    return webUserService.uploadMedia(websiteId, file, meta, userId);
  },
};
