import { z } from 'zod';
import { PublishStatus } from '@prisma/client';

export const fieldValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.undefined(),
    z.array(fieldValueSchema),
    z.record(z.string(), fieldValueSchema),
  ]),
);

/**
 * Body for creating or fully replacing a section's content.
 * `content` is a flat map of field name -> value (the field-level CMS shape).
 */
export const putSectionSchema = z
  .object({
    name: z.string().max(300).nullable().optional(),
    isActive: z.boolean().optional(),
    settings: z.record(z.string(), z.unknown()).nullable().optional(),
    content: z.record(z.string(), fieldValueSchema).default({}),
  })
  .strict();

export const patchSectionSchema = z
  .object({
    name: z.string().max(300).nullable().optional(),
    isActive: z.boolean().optional(),
    settings: z.record(z.string(), z.unknown()).nullable().optional(),
    content: z.record(z.string(), fieldValueSchema).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const publishWebsiteSchema = z
  .object({
    status: z.nativeEnum(PublishStatus).optional(),
  })
  .strict();

export const reorderSectionsSchema = z
  .object({
    order: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type PutSectionInput = z.infer<typeof putSectionSchema>;
export type PatchSectionInput = z.infer<typeof patchSectionSchema>;
export type PublishWebsiteInput = z.infer<typeof publishWebsiteSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;
