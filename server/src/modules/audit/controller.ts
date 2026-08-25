import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { auditService } from './service';
import { paginate } from '../../middlewares/paginate';

export const auditController = {
  list: [
    paginate(),
    asyncHandler(async (req: Request, res: Response) => {
      const p = req.pagination!;
      const from = req.query.from ? new Date(String(req.query.from)) : undefined;
      const to = req.query.to ? new Date(String(req.query.to)) : undefined;

      const result = await auditService.list({
        organizationId: req.activeOrg?.id ?? (typeof req.query.organizationId === 'string' ? req.query.organizationId : undefined),
        skip: p.skip,
        take: p.limit,
        action: (req.query.action as string) || undefined,
        resource: (req.query.resource as string) || undefined,
        userId: (req.query.userId as string) || undefined,
        search: (req.query.search as string) || undefined,
        from,
        to,
      });
      ok(res, result, 'OK');
    }),
  ],
};
