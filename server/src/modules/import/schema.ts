import { z } from 'zod';

const anyString = z.string().optional().nullable();

const contactSchema = z.object({
  email: anyString,
  phone: anyString,
  address: anyString,
});
const socialSchema = z.object({
  facebook: anyString,
  instagram: anyString,
  youtube: anyString,
  linkedin: anyString,
  whatsapp: anyString,
});

const settingsSchema = z.object({
  siteName: anyString,
  tagline: anyString,
  description: anyString,
  contact: contactSchema.optional(),
  social: socialSchema.optional(),
});

const sectionSchema = z.object({
  type: z.string().min(1),
  name: anyString,
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
  settings: z.any().optional(),
  content: z.any().optional(),
});

const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: anyString,
  metaDescription: anyString,
  template: z.string().optional(),
  isHome: z.boolean().optional(),
  sortOrder: z.number().optional(),
  sections: z.array(sectionSchema).optional(),
});

const menuItemSchema = z.object({
  label: z.string().min(1),
  url: anyString,
  sortOrder: z.number().optional(),
});

const menuSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  items: z.array(menuItemSchema).optional(),
});

const mediaSchema = z.object({
  sourceUrl: z.string().min(1),
  fileName: anyString,
  entityType: anyString,
});

const projectSchema = z
  .object({
    slug: z.string().optional(),
    title: z.string().min(1),
    tag: anyString,
    summary: anyString,
    description: z.any().optional(),
    heroImageUrl: anyString,
    cardImageUrl: anyString,
    featured: z.boolean().optional(),
  })
  .catchall(z.any());

const teamSchema = z
  .object({
    name: z.string().min(1),
    role: anyString,
    photoUrl: anyString,
    bio: anyString,
  })
  .catchall(z.any());

const testimonialSchema = z
  .object({
    quote: z.string().min(1),
    name: z.string().min(1),
    role: anyString,
    avatarUrl: anyString,
  })
  .catchall(z.any());

const blogSchema = z
  .object({
    slug: z.string().optional(),
    title: z.string().min(1),
    excerpt: anyString,
    content: z.any().optional(),
    coverImageUrl: anyString,
    authorName: anyString,
    publishedAt: anyString,
  })
  .catchall(z.any());

const eventSchema = z
  .object({
    slug: z.string().optional(),
    title: z.string().min(1),
    description: z.any().optional(),
    imageUrl: anyString,
    location: anyString,
    startDate: anyString,
  })
  .catchall(z.any());

const galleryItemSchema = z.object({
  imageUrl: z.string().min(1),
  altText: anyString,
  caption: anyString,
});

const gallerySchema = z
  .object({
    slug: z.string().optional(),
    title: z.string().min(1),
    description: anyString,
    coverImageUrl: anyString,
    items: z.array(galleryItemSchema).optional(),
  })
  .catchall(z.any());

const entitiesSchema = z.object({
  projects: z.array(projectSchema).optional(),
  team: z.array(teamSchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
  blogs: z.array(blogSchema).optional(),
  events: z.array(eventSchema).optional(),
  galleries: z.array(gallerySchema).optional(),
});

export const siteModelSchema = z.object({
  meta: z.any().optional(),
  settings: settingsSchema.optional(),
  pages: z.array(pageSchema).optional(),
  menus: z.array(menuSchema).optional(),
  media: z.array(mediaSchema).optional(),
  entities: entitiesSchema.optional(),
});

export const importSchema = z
  .object({
    mode: z.enum(['merge', 'replace']).default('merge'),
    dryRun: z.boolean().default(false),
    site: siteModelSchema,
  })
  .strict();

export type ImportInput = z.infer<typeof importSchema>;
