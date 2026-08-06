import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { webUserService } from './service';

export const webUserController = {
  getWebsite: asyncHandler(async (req: Request, res: Response) => {
    const result = await webUserService.getWebsite(req.user!.websiteId!);
    ok(res, result, 'OK');
  }),

  updateSection: asyncHandler(async (req: Request, res: Response) => {
    const result = await webUserService.updateSection(
      req.user!.websiteId!,
      req.params.sectionId,
      req.body,
      req,
    );
    ok(res, result, 'Section updated');
  }),

  uploadMedia: asyncHandler(async (req: Request, res: Response) => {
    const result = await webUserService.uploadMedia(
      req.user!.websiteId!,
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
