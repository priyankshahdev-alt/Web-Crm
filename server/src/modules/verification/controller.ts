import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { verificationService } from './service';

export const verificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await verificationService.list(req.params.id, req);
    ok(res, result, 'OK');
  }),

  claim: asyncHandler(async (req: Request, res: Response) => {
    const result = await verificationService.claim(req.params.id, req.body, req);
    ok(res, result, 'Domain claimed', 201);
  }),

  check: asyncHandler(async (req: Request, res: Response) => {
    const result = await verificationService.check(req.params.id, req.params.domainId, req.body, req);
    ok(res, result, 'Verification complete');
  }),
};
