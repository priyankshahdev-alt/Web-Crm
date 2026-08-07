import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { adminService } from './service';

export const adminController = {
  listWebsites: asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.listWebsites();
    ok(res, result, 'OK');
  }),

  getWebsite: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.getWebsite(req.params.websiteId);
    ok(res, result, 'OK');
  }),

  updateSection: asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.updateSection(
      req.params.websiteId,
      req.params.sectionId,
      req.body,
      req,
    );
    ok(res, result, 'Section updated');
  }),

  uploadMedia: asyncHandler(async (req: Request, res: Response) => {
    const websiteId = (req.body?.websiteId as string) || '';
    if (!websiteId) {
      throw ApiError.badRequest('websiteId is required for media upload');
    }
    const result = await adminService.uploadMedia(
      websiteId,
      req.file!,
      {
        entityType: (req.body?.entityType as string) || undefined,
        entityId: (req.body?.entityId as string) || undefined,
      },
      req.user!.id,
    );
    ok(res, result, 'Uploaded', 201);
  }),
};