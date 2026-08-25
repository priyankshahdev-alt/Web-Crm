import { z } from 'zod';

export const listMediaSchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    entityType: z.string().max(60).optional(),
    entityId: z.string().uuid().optional(),
    mimeType: z.string().max(120).optional(),
    folder: z.string().max(100).optional(),
    search: z.string().max(200).optional(),
  })
  .strict();

export const uploadMetadataSchema = z
  .object({
    entityType: z.string().max(60).optional().nullable(),
    entityId: z.string().uuid().optional().nullable(),
    folder: z.string().max(100).optional().nullable(),
  })
  .strict();

export const renameSchema = z
  .object({
    fileName: z.string().min(1).max(200),
  })
  .strict();

export const moveToFolderSchema = z
  .object({
    folder: z.string().max(100).nullable(),
  })
  .strict();
