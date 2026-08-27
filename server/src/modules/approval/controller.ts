import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { paginate } from '../../middlewares/paginate';
import { approvalService } from './service';

export const approvalController = {
  list: [
    paginate(),
    asyncHandler(async (req: Request, res: Response) => {
      const p = req.pagination!;
      const result = await approvalService.list({
        organizationId: req.activeOrg?.id ?? '',
        skip: p.skip,
        take: p.limit,
        status: (req.query.status as string) || undefined,
        resourceType: (req.query.resourceType as string) || undefined,
        search: (req.query.search as string) || undefined,
        from: req.query.from ? new Date(String(req.query.from)) : undefined,
        to: req.query.to ? new Date(String(req.query.to)) : undefined,
      });
      ok(res, result, 'OK');
    }),
  ],

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await approvalService.getById(req.params.id);
    ok(res, item, 'OK');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { resourceType, resourceId, resourceTitle, action, submitterNote, contentSnapshot } = req.body;
    const item = await approvalService.create(
      {
        organizationId: req.activeOrg?.id ?? '',
        resourceType,
        resourceId,
        resourceTitle,
        action,
        submitterNote,
        submitterId: req.user?.id,
        contentSnapshot,
      },
      req,
    );
    ok(res, item, 'Approval request created');
  }),

  review: asyncHandler(async (req: Request, res: Response) => {
    const { decision, reviewerNote } = req.body;
    const displayName = req.user
      ? [req.user.firstName, req.user.lastName].filter(Boolean).join(' ') || req.user.email
      : 'Reviewer';
    const item = await approvalService.review(
      req.params.id,
      {
        decision,
        reviewerNote,
        reviewerId: req.user?.id ?? '',
        reviewerName: displayName,
      },
      req,
    );
    ok(res, item, `Request ${decision.toLowerCase().replace('_', ' ')}`);
  }),

  pendingCount: asyncHandler(async (req: Request, res: Response) => {
    const organizationId = req.activeOrg?.id;
    if (!organizationId) {
      ok(res, { count: 0 }, 'OK');
      return;
    }
    const count = await approvalService.countPending(organizationId);
    ok(res, { count }, 'OK');
  }),
};
