import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { apiKeyService } from './service';

export const apiKeyController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await apiKeyService.list(req.params.id, req);
    ok(res, result, 'OK');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await apiKeyService.create(req.params.id, req.body, req);
    ok(res, result, 'API key created', 201);
  }),

  revoke: asyncHandler(async (req: Request, res: Response) => {
    const result = await apiKeyService.revoke(req.params.id, req.params.keyId, req);
    ok(res, result, 'API key revoked');
  }),
};
