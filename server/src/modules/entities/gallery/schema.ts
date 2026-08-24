import { z } from 'zod';
import { slugPattern } from '../simple/index';

const optionalSlug = z.string().regex(slugPattern, 'Invalid slug').optional();

export const galleryItemSchema = z.object({
  mediaId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().min(1).max(1000),
  mediaType: z.enum(['image', 'video']).optional(),
  altText: z.string().max(300).optional().nullable(),
  caption: z.string().max(1000).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
}).strict();

export const gallerySchema = z.object({
  title: z.string().min(1).max(300),
  slug: optionalSlug,
  description: z.string().max(5000).optional().nullable(),
  layout: z.enum(['grid', 'masonry', 'carousel']).optional(),
  coverImageUrl: z.string().max(1000).optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isHidden: z.boolean().optional(),
  programId: z.string().uuid().optional().nullable(),
  eventId: z.string().uuid().optional().nullable(),
  items: z.array(galleryItemSchema).optional(),
}).strict();

export const galleryUpdateSchema = gallerySchema.partial().strict().refine(
  (d) => Object.keys(d).length > 0,
  { message: 'At least one field required' },
);
