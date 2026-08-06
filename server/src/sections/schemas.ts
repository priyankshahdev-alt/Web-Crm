import { z } from 'zod';

export const uuid = z.string().uuid();

const cta = z
  .object({
    label: z.string().max(120).optional(),
    url: z.string().max(500).optional(),
  })
  .optional();

const contentItem = z
  .object({
    icon: z.string().max(120).optional(),
    title: z.string().max(200),
    description: z.string().max(2000).optional(),
  })
  .strict();

const statItem = z
  .object({
    icon: z.string().max(120).optional(),
    value: z.string().max(60),
    label: z.string().max(200),
  })
  .strict();

const paragraphList = z.array(z.string().max(5000)).max(50);
const entityIds = z.array(uuid).max(200).optional();

export const sectionSchemas = {
  hero: z
    .object({
      badge: z.string().max(200).optional(),
      heading: z.string().max(300),
      subheading: z.string().max(1000).optional(),
      primaryCta: cta,
      secondaryCta: cta,
      imageUrl: z.string().max(1000).optional(),
      mobileImageUrl: z.string().max(1000).optional(),
      altText: z.string().max(300).optional(),
    })
    .strict(),

  'hero-slider': z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      slides: z
        .array(
          z
            .object({
              id: z.string().max(120).optional(),
              eyebrow: z.string().max(200).optional(),
              title: z.string().max(300),
              accent: z.string().max(300).optional(),
              subtitle: z.string().max(1000).optional(),
              imageUrl: z.string().max(1000),
              mobileImageUrl: z.string().max(1000).optional(),
              subjectImageUrl: z.string().max(1000).optional(),
              subjectAlt: z.string().max(300).optional(),
              subjectPosition: z.string().max(120).optional(),
              ctaLabel: z.string().max(120).optional(),
              ctaUrl: z.string().max(500).optional(),
              cta2Label: z.string().max(120).optional(),
              cta2Url: z.string().max(500).optional(),
              panelLabel: z.string().max(200).optional(),
              panelTitle: z.string().max(200).optional(),
              altText: z.string().max(300).optional(),
            })
            .strict(),
        )
        .max(20),
    })
    .strict(),

  'page-hero': z
    .object({
      heading: z.string().max(300),
      subheading: z.string().max(1000).optional(),
      imageUrl: z.string().max(1000).optional(),
      mobileImageUrl: z.string().max(1000).optional(),
      altText: z.string().max(300).optional(),
    })
    .strict(),

  'banner-strip': z
    .object({
      title: z.string().max(300),
      subtitle: z.string().max(1000).optional(),
      ctaLabel: z.string().max(120).optional(),
      ctaUrl: z.string().max(500).optional(),
      imageUrl: z.string().max(1000).optional(),
    })
    .strict(),

  about: z
    .object({
      tag: z.string().max(200).optional(),
      heading: z.string().max(300),
      paragraphs: paragraphList,
      imageUrl: z.string().max(1000).optional(),
      imageAlt: z.string().max(300).optional(),
      cta,
    })
    .strict(),

  story: z
    .object({
      tag: z.string().max(200).optional(),
      heading: z.string().max(300),
      paragraphs: paragraphList,
      quote: z.string().max(1000).optional(),
      imageUrl: z.string().max(1000).optional(),
      imageAlt: z.string().max(300).optional(),
    })
    .strict(),

  stats: z
    .object({
      heading: z.string().max(300).optional(),
      items: z.array(statItem).min(1).max(12),
    })
    .strict(),

  cards: z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      items: z.array(contentItem).min(1).max(30),
    })
    .strict(),

  values: z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      items: z.array(contentItem).min(1).max(30),
    })
    .strict(),

  sectors: z
    .object({
      heading: z.string().max(300).optional(),
      items: z.array(contentItem).min(1).max(30),
    })
    .strict(),

  'projects-grid': z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      entityIds,
      showAll: z.boolean().optional(),
      layout: z.string().max(60).optional(),
      cta,
      projects: z
        .array(
          z
            .object({
              title: z.string().max(300),
              tag: z.string().max(120).optional(),
              description: z.string().max(2000).optional(),
              image: z.string().max(1000).optional(),
              url: z.string().max(500).optional(),
              position: z.string().max(60).optional(),
            })
            .strict(),
        )
        .max(30)
        .optional(),
    })
    .strict(),

  'program-detail': z
    .object({
      tag: z.string().max(200).optional(),
      heading: z.string().max(300),
      paragraphs: paragraphList,
      mission: z.string().max(2000).optional(),
      whyItMatters: z.string().max(2000).optional(),
      services: z.array(contentItem).max(30).optional(),
      beneficiaries: z.array(contentItem).max(30).optional(),
      impact: z.array(contentItem).max(30).optional(),
      stats: z.array(statItem).max(12).optional(),
      cta,
      imageUrl: z.string().max(1000).optional(),
      imageAlt: z.string().max(300).optional(),
    })
    .strict(),

  'mission-vision': z
    .object({
      mission: z
        .object({ title: z.string().max(300), description: z.string().max(3000) })
        .strict(),
      vision: z
        .object({ title: z.string().max(300), description: z.string().max(3000) })
        .strict(),
    })
    .strict(),

  cta: z
    .object({
      heading: z.string().max(300),
      paragraph: z.string().max(1000).optional(),
      buttonLabel: z.string().max(120).optional(),
      buttonUrl: z.string().max(500).optional(),
      backgroundImageUrl: z.string().max(1000).optional(),
      align: z.enum(['left', 'center', 'right']).optional(),
    })
    .strict(),

  team: z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      entityIds,
      showAll: z.boolean().optional(),
      layout: z.string().max(60).optional(),
    })
    .strict(),

  testimonials: z
    .object({
      heading: z.string().max(300).optional(),
      items: z
        .array(
          z
            .object({
              quote: z.string().max(3000),
              name: z.string().max(200),
              role: z.string().max(300).optional(),
              avatarUrl: z.string().max(1000).optional(),
              color: z.string().max(30).optional(),
            })
            .strict(),
        )
        .min(1)
        .max(50),
    })
    .strict(),

  stories: z
    .object({
      heading: z.string().max(300).optional(),
      entityIds,
      categoryId: uuid.optional(),
    })
    .strict(),

  gallery: z
    .object({
      heading: z.string().max(300).optional(),
      galleryId: uuid.optional(),
      layout: z.string().max(60).optional(),
      images: z.array(z.string().max(1000)).max(200).optional(),
    })
    .strict(),

  partners: z
    .object({
      heading: z.string().max(300).optional(),
      entityIds,
      showAll: z.boolean().optional(),
    })
    .strict(),

  documents: z
    .object({
      heading: z.string().max(300).optional(),
      categoryId: uuid.optional(),
    })
    .strict(),

  campaigns: z
    .object({
      heading: z.string().max(300).optional(),
      entityIds,
      showAll: z.boolean().optional(),
    })
    .strict(),

  donate: z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      causes: z
        .array(z.object({ title: z.string().max(300), description: z.string().max(2000).optional() }).strict())
        .max(50)
        .optional(),
      amounts: z.array(z.number().positive()).max(20).optional(),
      payment: z.record(z.string(), z.unknown()).optional(),
    })
    .strict(),

  'contact-info': z
    .object({
      heading: z.string().max(300).optional(),
      items: z
        .array(
          z
            .object({
              icon: z.string().max(120).optional(),
              label: z.string().max(200),
              value: z.string().max(1000),
              type: z.enum(['address', 'phone', 'email', 'other']).optional(),
            })
            .strict(),
        )
        .min(1)
        .max(20),
    })
    .strict(),

  map: z
    .object({
      heading: z.string().max(300).optional(),
      url: z.string().max(1000).optional(),
      embedUrl: z.string().max(1000).optional(),
    })
    .strict(),

  form: z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      formType: z.enum(['contact', 'volunteer', 'career', 'custom']),
      fields: z
        .array(
          z
            .object({
              name: z.string().max(120),
              label: z.string().max(200),
              type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'number']),
              placeholder: z.string().max(300).optional(),
              required: z.boolean().optional(),
              options: z.array(z.string().max(200)).optional(),
            })
            .strict(),
        )
        .max(50)
        .optional(),
      submitLabel: z.string().max(120).optional(),
      successMessage: z.string().max(1000).optional(),
    })
    .strict(),

  legal: z
    .object({
      title: z.string().max(300).optional(),
      blocks: z
        .array(z.object({ title: z.string().max(300), text: z.string().max(20000) }).strict())
        .min(1)
        .max(200),
    })
    .strict(),

  awards: z
    .object({
      heading: z.string().max(300).optional(),
      entityIds,
      showAll: z.boolean().optional(),
    })
    .strict(),

  newsletter: z
    .object({
      heading: z.string().max(300).optional(),
      subheading: z.string().max(1000).optional(),
      placeholder: z.string().max(200).optional(),
      buttonLabel: z.string().max(120).optional(),
    })
    .strict(),

  faq: z
    .object({
      heading: z.string().max(300).optional(),
      entityIds,
      showAll: z.boolean().optional(),
    })
    .strict(),

  location: z
    .object({
      heading: z.string().max(300).optional(),
      locationId: uuid.optional(),
    })
    .strict(),
} as const;

export type SectionType = keyof typeof sectionSchemas;
export type SectionContent<T extends SectionType = SectionType> = z.infer<
  (typeof sectionSchemas)[T]
>;
