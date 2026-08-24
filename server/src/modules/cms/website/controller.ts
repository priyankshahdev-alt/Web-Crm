import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ok } from '../../../utils/ApiResponse';
import { websiteService } from './service';

export const websiteController = {
  getLiveImages: asyncHandler(async (req: Request, res: Response) => {
    const images = await websiteService.getLiveImages(req.params.slug);
    ok(res, images, 'OK');
  }),
  get: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.getWebsite(req.params.slug);
    ok(res, result, 'OK');
  }),

  content: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.getContentTree(req.params.slug);
    ok(res, result, 'OK');
  }),

  getPage: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.getPage(req.params.slug, req.params.pageSlug);
    ok(res, result, 'OK');
  }),

  getSection: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.getSection(
      req.params.slug,
      req.params.pageSlug,
      req.params.sectionType,
    );
    ok(res, result, 'OK');
  }),

  putSection: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.upsertSection(
      req.params.slug,
      req.params.pageSlug,
      req.params.sectionType,
      req.body,
      req,
    );
    ok(res, result, 'Section saved and published');
  }),

  patchSection: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.patchSection(
      req.params.slug,
      req.params.pageSlug,
      req.params.sectionType,
      req.body,
      req,
    );
    ok(res, result, 'Section updated and published');
  }),

  removeSection: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.removeSection(
      req.params.slug,
      req.params.pageSlug,
      req.params.sectionType,
      req,
    );
    ok(res, result, 'Section removed');
  }),

  reorderSections: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.reorderSections(
      req.params.slug,
      req.params.pageSlug,
      req.body.order,
      req,
    );
    ok(res, result, 'Section order updated and published');
  }),

  publish: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.publish(req.params.slug, req);
    ok(res, result, 'Website published');
  }),

  saveSectionDraft: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.saveSectionDraft(
      req.params.slug,
      req.params.pageSlug,
      req.params.sectionType,
      req.body,
      req,
    );
    ok(res, result, 'Draft saved (not live yet)');
  }),

  publishPage: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.publishPage(req.params.slug, req.params.pageSlug, req);
    ok(res, result, 'Page published');
  }),

  discardPageDrafts: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.discardPageDrafts(
      req.params.slug,
      req.params.pageSlug,
      req,
    );
    ok(res, result, 'Drafts discarded');
  }),

  previewLink: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.getPreviewLink(req.params.slug, req);
    ok(res, result, 'OK');
  }),

  upload: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.upload(
      req.params.slug,
      req.file!,
      {
        entityType: (req.body?.entityType as string) || undefined,
        entityId: (req.body?.entityId as string) || undefined,
      },
      req.user!.id,
    );
    ok(res, result, 'Uploaded', 201);
  }),

  removeMedia: asyncHandler(async (req: Request, res: Response) => {
    const result = await websiteService.removeMedia(
      req.params.slug,
      req.params.mediaId,
      req.user!.id,
    );
    ok(res, result, 'Media deleted');
  }),
};
