import { z } from 'zod';
import { slugPattern } from '../simple/index';

const optionalText = z.string().max(10000).optional().nullable();
const optionalSlug = z.string().regex(slugPattern, 'Invalid slug').optional();
const status = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional();
const order = z.coerce.number().int().min(0).optional();

const child = (required: string[]) => z.object({
  id: z.string().uuid().optional(),
  title: required.includes('title') ? z.string().min(1).max(300) : z.string().max(300).optional(),
  description: optionalText,
  icon: z.string().max(100).optional().nullable(),
  imageUrl: z.string().max(1000).optional().nullable(),
  altText: z.string().max(300).optional().nullable(),
  label: z.string().max(300).optional(),
  value: z.string().max(300).optional(),
  sortOrder: order,
}).strict();

export const projectSchema = z.object({
  slug: optionalSlug,
  title: z.string().min(1).max(300),
  tag: z.string().max(200).optional().nullable(),
  summary: optionalText,
  description: z.record(z.string(), z.unknown()).optional().nullable(),
  heroImageUrl: z.string().max(1000).optional().nullable(),
  heroImageMobileUrl: z.string().max(1000).optional().nullable(),
  cardImageUrl: z.string().max(1000).optional().nullable(),
  status,
  featured: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  sortOrder: order,
  images: z.array(child([]).extend({ imageUrl: z.string().min(1).max(1000) })).optional(),
  services: z.array(child(['title'])).optional(),
  impacts: z.array(child(['title'])).optional(),
  stats: z.array(z.object({ label: z.string().min(1).max(300), value: z.string().min(1).max(300), sortOrder: order }).strict()).optional(),
}).strict();

export const projectUpdateSchema = projectSchema.partial().strict().refine(
  (d) => Object.keys(d).length > 0,
  { message: 'At least one field required' },
);
