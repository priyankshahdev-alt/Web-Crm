import { z } from 'zod';

export const updateSectionSchema = z
  .object({
    name: z.string().max(300).optional().nullable(),
    isActive: z.boolean().optional(),
    settings: z.record(z.string(), z.unknown()).optional().nullable(),
    content: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateWebsiteSectionInput = z.infer<typeof updateSectionSchema>;
