import { z } from 'zod';
import { makeCrud } from '../factory';
import { slugPattern } from './index';

const optionalString = z.string().max(1000).optional().nullable();
const requiredString = (max: number) => z.string().min(1).max(max);
const optionalText = z.string().max(10000).optional().nullable();
const status = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional();
const optionalSlug = z.string().regex(slugPattern, 'Invalid slug').optional();
const featured = z.boolean().optional();
const jsonContent = z.record(z.string(), z.unknown()).optional().nullable();

export const eventCrud = makeCrud({
  resource: 'event',
  model: 'event',
  permissionBase: 'event',
  searchFields: ['title', 'location'],
  slugFrom: 'title',
  extraFilters: { status: 'status' },
  createSchema: z.object({
    title: requiredString(300),
    slug: optionalSlug,
    description: jsonContent,
    imageUrl: z.string().max(1000).optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    location: optionalString,
    status,
    featured,
    isHidden: z.boolean().optional(),
  }).strict(),
  updateSchema: z.object({
    title: requiredString(300).optional(),
    slug: optionalSlug,
    description: jsonContent,
    imageUrl: z.string().max(1000).optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    location: optionalString,
    status,
    featured,
    isHidden: z.boolean().optional(),
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const campaignCrud = makeCrud({
  resource: 'campaign',
  model: 'campaign',
  permissionBase: 'campaign',
  searchFields: ['title'],
  slugFrom: 'title',
  extraFilters: { status: 'status' },
  include: {
    _count: { select: { donations: true } },
  },
  createSchema: z.object({
    title: requiredString(300),
    slug: optionalSlug,
    description: jsonContent,
    targetAmount: z.coerce.number().positive().multipleOf(0.01).optional().nullable(),
    imageUrl: z.string().max(1000).optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    status,
    featured,
  }).strict(),
  updateSchema: z.object({
    title: requiredString(300).optional(),
    slug: optionalSlug,
    description: jsonContent,
    targetAmount: z.coerce.number().positive().multipleOf(0.01).optional().nullable(),
    imageUrl: z.string().max(1000).optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    status,
    featured,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const blogCategoryCrud = makeCrud({
  resource: 'blog-category',
  model: 'blogCategory',
  permissionBase: 'blog',
  searchFields: ['name'],
  slugFrom: 'name',
  createSchema: z.object({
    name: requiredString(200),
    slug: optionalSlug,
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    slug: optionalSlug,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const blogCrud = makeCrud({
  resource: 'blog',
  model: 'blog',
  permissionBase: 'blog',
  searchFields: ['title', 'excerpt', 'authorName'],
  slugFrom: 'title',
  extraFilters: { categoryId: 'categoryId', status: 'status' },
  listInclude: { category: { select: { id: true, name: true, slug: true } } },
  include: { category: { select: { id: true, name: true, slug: true } } },
  createSchema: z.object({
    categoryId: z.string().uuid().optional().nullable(),
    title: requiredString(300),
    slug: optionalSlug,
    excerpt: optionalText,
    content: jsonContent,
    coverImageUrl: z.string().max(1000).optional().nullable(),
    authorName: z.string().max(200).optional().nullable(),
    publishedAt: z.string().datetime().optional().nullable(),
    status,
    featured,
  }).strict(),
  updateSchema: z.object({
    categoryId: z.string().uuid().optional().nullable(),
    title: requiredString(300).optional(),
    slug: optionalSlug,
    excerpt: optionalText,
    content: jsonContent,
    coverImageUrl: z.string().max(1000).optional().nullable(),
    authorName: z.string().max(200).optional().nullable(),
    publishedAt: z.string().datetime().optional().nullable(),
    status,
    featured,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const documentCategoryCrud = makeCrud({
  resource: 'document-category',
  model: 'documentCategory',
  permissionBase: 'document',
  searchFields: ['name'],
  slugFrom: 'name',
  createSchema: z.object({
    name: requiredString(200),
    slug: optionalSlug,
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    slug: optionalSlug,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const documentCrud = makeCrud({
  resource: 'document',
  model: 'document',
  permissionBase: 'document',
  searchFields: ['title'],
  extraFilters: { categoryId: 'categoryId', status: 'status' },
  listInclude: { category: { select: { id: true, name: true, slug: true } } },
  include: { category: { select: { id: true, name: true, slug: true } } },
  createSchema: z.object({
    categoryId: z.string().uuid().optional().nullable(),
    title: requiredString(300),
    description: optionalText,
    fileUrl: z.string().min(1).max(1000),
    fileType: z.string().max(60).optional(),
    fileSize: z.coerce.number().int().nonnegative().optional().nullable(),
    status,
  }).strict(),
  updateSchema: z.object({
    categoryId: z.string().uuid().optional().nullable(),
    title: requiredString(300).optional(),
    description: optionalText,
    fileUrl: z.string().min(1).max(1000).optional(),
    fileType: z.string().max(60).optional(),
    fileSize: z.coerce.number().int().nonnegative().optional().nullable(),
    status,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});
