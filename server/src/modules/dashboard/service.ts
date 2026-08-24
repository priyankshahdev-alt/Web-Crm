import type { Request } from 'express';
import { ApiError } from '../../utils/ApiError';
import { assertCanManageOrg } from '../organization/service';
import { dashboardRepository } from './repository';

export const dashboardService = {
  async overview(req: Request) {
    if (!req.user) throw ApiError.unauthorized();
    const scope = await dashboardRepository.orgIdsFor(req.user);
    return dashboardRepository.overview(scope);
  },

  async websites(req: Request) {
    if (!req.user) throw ApiError.unauthorized();
    const scope = await dashboardRepository.orgIdsFor(req.user);
    return dashboardRepository.websites(scope);
  },

  async siteById(id: string, req: Request) {
    await assertCanManageOrg(req, id);
    return dashboardRepository.siteStats(id);
  },

  async myWebsite(req: Request) {
    if (!req.activeOrg) {
      throw ApiError.badRequest('Provide an X-Organization-Id header for your website');
    }
    return dashboardRepository.siteStatsDetailed(req.activeOrg.id);
  },
};
