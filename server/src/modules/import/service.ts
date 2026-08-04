import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Prisma, PublishStatus } from '@prisma/client';
import { prisma } from '../../libs/prisma';
import { config } from '../../config';
import { supabase, storageReady } from '../../libs/supabase';
import { recordAudit } from '../../utils/audit';
import { safeFetchBuffer } from '../verification/ssrf';
import { slugify } from '../entities/factory';
import type { ImportInput, siteModelSchema } from './schema';
import type { z } from 'zod';

type SiteModel = z.infer<typeof siteModelSchema>;
type Tx = Prisma.TransactionClient;

const IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };
  return map[mime] ?? 'bin';
}

function isImageMime(mime: string): boolean {
  return mime.startsWith('image/');
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function rewriteUrls(node: unknown, map: Map<string, string>): unknown {
  if (typeof node === 'string') {
    const mapped = map.get(node);
    return mapped ?? node;
  }
  if (Array.isArray(node)) {
    return node.map((item) => rewriteUrls(item, map));
  }
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = rewriteUrls(value, map);
    }
    return out;
  }
  return node;
}

function computePreview(site: SiteModel) {
  return {
    pages: site.pages?.length ?? 0,
    sections: (site.pages ?? []).reduce((n, p) => n + (p.sections?.length ?? 0), 0),
    menus: site.menus?.length ?? 0,
    menuItems: (site.menus ?? []).reduce((n, m) => n + (m.items?.length ?? 0), 0),
    media: site.media?.length ?? 0,
    projects: site.entities?.projects?.length ?? 0,
    team: site.entities?.team?.length ?? 0,
    testimonials: site.entities?.testimonials?.length ?? 0,
    blogs: site.entities?.blogs?.length ?? 0,
    events: site.entities?.events?.length ?? 0,
    galleries: site.entities?.galleries?.length ?? 0,
    galleryItems: (site.entities?.galleries ?? []).reduce(
      (n, g) => n + (g.items?.length ?? 0),
      0,
    ),
  };
}

async function importMedia(
  orgId: string,
  orgSlug: string,
  media: NonNullable<SiteModel['media']>,
  userId?: string,
): Promise<{ map: Map<string, string>; warnings: string[] }> {
  const map = new Map<string, string>();
  const warnings: string[] = [];

  if (media.length === 0) return { map, warnings };
  if (!storageReady() || !supabase) {
    warnings.push('Storage is not configured; media was imported with original URLs.');
    return { map, warnings };
  }

  for (const entry of media) {
    try {
      const result = await safeFetchBuffer(entry.sourceUrl, { maxBytes: 15_000_000 });
      if (result.status < 200 || result.status >= 300) {
        warnings.push(`Skipped media (HTTP ${result.status}): ${entry.sourceUrl}`);
        continue;
      }
      const mime =
        (result.contentType?.split(';')[0] ?? '').trim() ||
        extFromMime(path.extname(entry.sourceUrl)).replace(/^/, 'image/');
      if (!IMAGE_MIME.has(mime) && !isImageMime(mime)) {
        warnings.push(`Skipped non-image media (${mime}): ${entry.sourceUrl}`);
        continue;
      }

      const safeName = path
        .basename(entry.fileName || entry.sourceUrl.split('?')[0])
        .replace(/[^\w.\- ]/g, '_')
        .slice(0, 120);
      const now = new Date();
      const entityDir = entry.entityType ?? 'imported';
      const key = `${orgSlug}/${entityDir}/${now.getUTCFullYear()}/${String(
        now.getUTCMonth() + 1,
      ).padStart(2, '0')}/${randomUUID()}.${extFromMime(mime)}`;

      const { error } = await supabase.storage
        .from(config.supabase.bucket)
        .upload(key, result.buffer, { contentType: mime });
      if (error) {
        warnings.push(`Upload failed for ${entry.sourceUrl}: ${error.message}`);
        continue;
      }

      const baseUrl =
        config.supabase.publicUrl ||
        `${config.supabase.url}/storage/v1/object/public/${config.supabase.bucket}`;
      const url = `${baseUrl.replace(/\/+$/, '')}/${key}`;

      await prisma.media.create({
        data: {
          organizationId: orgId,
          fileName: safeName || key,
          mimeType: mime,
          size: result.buffer.byteLength,
          bucket: config.supabase.bucket,
          key,
          url,
          thumbnailUrl: isImageMime(mime) ? url : undefined,
          entityType: entry.entityType ?? 'imported',
          uploadedById: userId ?? null,
        },
      });

      map.set(entry.sourceUrl, url);
    } catch (error) {
      warnings.push(`Skipped media ${entry.sourceUrl}: ${error instanceof Error ? error.message : 'error'}`);
    }
  }

  return { map, warnings };
}

async function upsertSettings(tx: Tx, orgId: string, settings: NonNullable<SiteModel['settings']>) {
  const entries: Record<string, unknown> = {};
  if (settings.siteName) entries['site.siteName'] = settings.siteName;
  if (settings.tagline) entries['site.tagline'] = settings.tagline;
  if (settings.description) entries['site.description'] = settings.description;
  if (settings.contact?.email) entries['contact.email'] = settings.contact.email;
  if (settings.contact?.phone) entries['contact.phone'] = settings.contact.phone;
  if (settings.contact?.address) entries['contact.address'] = settings.contact.address;
  if (settings.social?.facebook) entries['social.facebook'] = settings.social.facebook;
  if (settings.social?.instagram) entries['social.instagram'] = settings.social.instagram;
  if (settings.social?.youtube) entries['social.youtube'] = settings.social.youtube;
  if (settings.social?.linkedin) entries['social.linkedin'] = settings.social.linkedin;
  if (settings.social?.whatsapp) entries['whatsapp.number'] = settings.social.whatsapp;

  for (const [key, value] of Object.entries(entries)) {
    await tx.organizationSetting.upsert({
      where: { organizationId_key: { organizationId: orgId, key } },
      update: { value: value as Prisma.InputJsonValue },
      create: { organizationId: orgId, key, value: value as Prisma.InputJsonValue },
    });
  }
  return entries;
}

async function importPages(tx: Tx, orgId: string, pages: NonNullable<SiteModel['pages']>) {
  let created = 0;
  let updated = 0;
  let sectionCount = 0;

  for (const page of pages) {
    const slug = slugify(page.slug) || 'home';

    const existing = await tx.page.findUnique({
      where: { organizationId_slug: { organizationId: orgId, slug } },
    });
    let createdPage: { id: string };
    if (existing) {
      await tx.page.update({
        where: { id: existing.id },
        data: {
          title: page.title,
          metaTitle: page.metaTitle ?? existing.metaTitle,
          metaDescription: page.metaDescription ?? existing.metaDescription,
          template: page.template ?? existing.template,
          isHome: page.isHome ?? existing.isHome,
          sortOrder: page.sortOrder ?? existing.sortOrder,
          status: PublishStatus.PUBLISHED,
        },
      });
      await tx.pageSection.deleteMany({ where: { pageId: existing.id } });
      createdPage = existing;
      updated += 1;
    } else {
      createdPage = await tx.page.create({
        data: {
          organizationId: orgId,
          slug,
          title: page.title,
          metaTitle: page.metaTitle ?? page.title,
          metaDescription: page.metaDescription ?? null,
          template: page.template ?? 'inner',
          isHome: page.isHome ?? false,
          sortOrder: page.sortOrder ?? created,
          status: PublishStatus.PUBLISHED,
        },
      });
      created += 1;
    }

    for (const [i, section] of (page.sections ?? []).entries()) {
      await tx.pageSection.create({
        data: {
          pageId: createdPage.id,
          organizationId: orgId,
          type: section.type,
          name: section.name ?? section.type,
          sortOrder: section.sortOrder ?? i + 1,
          isActive: section.isActive ?? true,
          settings: (section.settings as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          content: (section.content as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        },
      });
      sectionCount += 1;
    }
  }

  return { created, updated, sectionCount };
}

async function importMenus(tx: Tx, orgId: string, menus: NonNullable<SiteModel['menus']>) {
  let created = 0;
  let updated = 0;
  let itemCount = 0;

  for (const menu of menus) {
    const location = menu.location || 'main-nav';
    const existing = await tx.menu.findUnique({
      where: { organizationId_location: { organizationId: orgId, location } },
    });
    let createdMenu: { id: string };
    if (existing) {
      await tx.menu.update({ where: { id: existing.id }, data: { name: menu.name } });
      await tx.menuItem.deleteMany({ where: { menuId: existing.id } });
      createdMenu = existing;
      updated += 1;
    } else {
      createdMenu = await tx.menu.create({
        data: { organizationId: orgId, name: menu.name, location },
      });
      created += 1;
    }

    for (const [i, item] of (menu.items ?? []).entries()) {
      await tx.menuItem.create({
        data: {
          menuId: createdMenu.id,
          organizationId: orgId,
          label: item.label,
          url: item.url ?? null,
          sortOrder: item.sortOrder ?? i + 1,
          isActive: true,
        },
      });
      itemCount += 1;
    }
  }

  return { created, updated, itemCount };
}

async function importProjects(tx: Tx, orgId: string, projects: NonNullable<SiteModel['entities']>['projects']) {
  let created = 0;
  let updated = 0;
  const seen = new Set<string>();
  for (const project of projects ?? []) {
    const slug = slugify(project.slug || project.title) || `project-${Math.random().toString(36).slice(2, 8)}`;
    seen.add(slug);
    const existing = await tx.project.findUnique({
      where: { organizationId_slug: { organizationId: orgId, slug } },
    });
    const data = {
      title: project.title,
      tag: project.tag ?? undefined,
      summary: project.summary ?? undefined,
      description: (project.description as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      heroImageUrl: project.heroImageUrl ?? undefined,
      cardImageUrl: project.cardImageUrl ?? undefined,
      featured: project.featured ?? false,
      status: PublishStatus.PUBLISHED,
    };
    if (existing) {
      await tx.project.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await tx.project.create({ data: { ...data, slug, organizationId: orgId } });
      created += 1;
    }
  }
  return { created, updated, seen };
}

async function importTeam(tx: Tx, orgId: string, team: NonNullable<SiteModel['entities']>['team']) {
  let created = 0;
  let updated = 0;
  for (const member of team ?? []) {
    const existing = await tx.teamMember.findFirst({
      where: { organizationId: orgId, name: member.name },
    });
    const data = {
      role: member.role ?? undefined,
      photoUrl: member.photoUrl ?? undefined,
      bio: member.bio ?? undefined,
      isActive: true,
    };
    if (existing) {
      await tx.teamMember.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await tx.teamMember.create({ data: { ...data, name: member.name, organizationId: orgId } });
      created += 1;
    }
  }
  return { created, updated };
}

async function importTestimonials(tx: Tx, orgId: string, testimonials: NonNullable<SiteModel['entities']>['testimonials']) {
  let created = 0;
  let updated = 0;
  for (const item of testimonials ?? []) {
    const existing = await tx.testimonial.findFirst({
      where: { organizationId: orgId, name: item.name },
    });
    const data = {
      quote: item.quote,
      role: item.role ?? undefined,
      avatarUrl: item.avatarUrl ?? undefined,
      isActive: true,
    };
    if (existing) {
      await tx.testimonial.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await tx.testimonial.create({ data: { ...data, name: item.name, organizationId: orgId } });
      created += 1;
    }
  }
  return { created, updated };
}

async function importBlogs(tx: Tx, orgId: string, blogs: NonNullable<SiteModel['entities']>['blogs']) {
  let created = 0;
  let updated = 0;
  const seen = new Set<string>();
  for (const blog of blogs ?? []) {
    const slug = slugify(blog.slug || blog.title) || `post-${Math.random().toString(36).slice(2, 8)}`;
    seen.add(slug);
    const existing = await tx.blog.findUnique({
      where: { organizationId_slug: { organizationId: orgId, slug } },
    });
    const data = {
      title: blog.title,
      excerpt: blog.excerpt ?? undefined,
      content: (blog.content as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      coverImageUrl: blog.coverImageUrl ?? undefined,
      authorName: blog.authorName ?? undefined,
      publishedAt: toDate(blog.publishedAt),
      status: PublishStatus.PUBLISHED,
    };
    if (existing) {
      await tx.blog.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await tx.blog.create({ data: { ...data, slug, organizationId: orgId } });
      created += 1;
    }
  }
  return { created, updated, seen };
}

async function importEvents(tx: Tx, orgId: string, events: NonNullable<SiteModel['entities']>['events']) {
  let created = 0;
  let updated = 0;
  const seen = new Set<string>();
  for (const event of events ?? []) {
    const slug = slugify(event.slug || event.title) || `event-${Math.random().toString(36).slice(2, 8)}`;
    seen.add(slug);
    const existing = await tx.event.findUnique({
      where: { organizationId_slug: { organizationId: orgId, slug } },
    });
    const data = {
      title: event.title,
      description: (event.description as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      imageUrl: event.imageUrl ?? undefined,
      location: event.location ?? undefined,
      startDate: toDate(event.startDate),
      status: PublishStatus.PUBLISHED,
    };
    if (existing) {
      await tx.event.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await tx.event.create({ data: { ...data, slug, organizationId: orgId } });
      created += 1;
    }
  }
  return { created, updated, seen };
}

async function importGalleries(
  tx: Tx,
  orgId: string,
  galleries: NonNullable<SiteModel['entities']>['galleries'],
) {
  let created = 0;
  let updated = 0;
  let itemCount = 0;
  const seen = new Set<string>();
  for (const gallery of galleries ?? []) {
    const slug = slugify(gallery.slug || gallery.title) || `gallery-${Math.random().toString(36).slice(2, 8)}`;
    seen.add(slug);
    const existing = await tx.gallery.findUnique({
      where: { organizationId_slug: { organizationId: orgId, slug } },
    });
    let createdGallery: { id: string };
    if (existing) {
      await tx.gallery.update({
        where: { id: existing.id },
        data: {
          title: gallery.title,
          description: gallery.description ?? undefined,
          coverImageUrl: gallery.coverImageUrl ?? undefined,
          status: PublishStatus.PUBLISHED,
        },
      });
      await tx.galleryItem.deleteMany({ where: { galleryId: existing.id } });
      createdGallery = existing;
      updated += 1;
    } else {
      createdGallery = await tx.gallery.create({
        data: {
          organizationId: orgId,
          slug,
          title: gallery.title,
          description: gallery.description ?? null,
          coverImageUrl: gallery.coverImageUrl ?? null,
          status: PublishStatus.PUBLISHED,
        },
      });
      created += 1;
    }
    for (const [i, item] of (gallery.items ?? []).entries()) {
      await tx.galleryItem.create({
        data: {
          galleryId: createdGallery.id,
          organizationId: orgId,
          imageUrl: item.imageUrl,
          altText: item.altText ?? null,
          caption: item.caption ?? null,
          sortOrder: i + 1,
        },
      });
      itemCount += 1;
    }
  }
  return { created, updated, itemCount, seen };
}

export interface ImportResult {
  dryRun: boolean;
  mode: 'merge' | 'replace';
  preview: ReturnType<typeof computePreview>;
  counts: {
    settings: number;
    pages: { created: number; updated: number };
    sections: number;
    menus: { created: number; updated: number };
    menuItems: number;
    media: { uploaded: number; skipped: number };
    projects: { created: number; updated: number };
    team: { created: number; updated: number };
    testimonials: { created: number; updated: number };
    blogs: { created: number; updated: number };
    events: { created: number; updated: number };
    galleries: { created: number; updated: number; items: number };
  };
  warnings: string[];
}

export const importService = {
  async run(
    org: { id: string; slug: string },
    input: ImportInput,
    req: { user?: { id: string } },
  ): Promise<ImportResult> {
    const site = input.site;
    const warnings: string[] = [];

    if (input.dryRun) {
      return {
        dryRun: true,
        mode: input.mode,
        preview: computePreview(site),
        counts: {
          settings: 0,
          pages: { created: 0, updated: 0 },
          sections: 0,
          menus: { created: 0, updated: 0 },
          menuItems: 0,
          media: { uploaded: 0, skipped: 0 },
          projects: { created: 0, updated: 0 },
          team: { created: 0, updated: 0 },
          testimonials: { created: 0, updated: 0 },
          blogs: { created: 0, updated: 0 },
          events: { created: 0, updated: 0 },
          galleries: { created: 0, updated: 0, items: 0 },
        },
        warnings,
      };
    }

    const { map, warnings: mediaWarnings } = await importMedia(
      org.id,
      org.slug,
      site.media ?? [],
      req.user?.id,
    );
    warnings.push(...mediaWarnings);

    const rewrittenSite = rewriteUrls(site, map) as SiteModel;

    const result = await prisma.$transaction(async (tx) => {
      const settingKeys = await upsertSettings(tx, org.id, rewrittenSite.settings ?? {});

      if (input.mode === 'replace') {
        const pages = rewrittenSite.pages ?? [];
        const slugs = new Set(pages.map((p) => slugify(p.slug) || 'home'));
        const allPages = await tx.page.findMany({ where: { organizationId: org.id } });
        for (const page of allPages) {
          if (!slugs.has(page.slug)) {
            await tx.page.delete({ where: { id: page.id } });
          }
        }

        const menus = rewrittenSite.menus ?? [];
        const locations = new Set(menus.map((m) => m.location || 'main-nav'));
        const allMenus = await tx.menu.findMany({ where: { organizationId: org.id } });
        for (const menu of allMenus) {
          if (!locations.has(menu.location)) {
            await tx.menu.delete({ where: { id: menu.id } });
          }
        }
      }

      const pages = await importPages(tx, org.id, rewrittenSite.pages ?? []);
      const menus = await importMenus(tx, org.id, rewrittenSite.menus ?? []);
      const projects = await importProjects(tx, org.id, rewrittenSite.entities?.projects);
      const team = await importTeam(tx, org.id, rewrittenSite.entities?.team);
      const testimonials = await importTestimonials(tx, org.id, rewrittenSite.entities?.testimonials);
      const blogs = await importBlogs(tx, org.id, rewrittenSite.entities?.blogs);
      const events = await importEvents(tx, org.id, rewrittenSite.entities?.events);
      const galleries = await importGalleries(tx, org.id, rewrittenSite.entities?.galleries);

      return {
        settings: Object.keys(settingKeys).length,
        pages,
        menus,
        projects,
        team,
        testimonials,
        blogs,
        events,
        galleries,
      };
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId: org.id,
      action: 'IMPORT',
      resource: 'import',
      resourceId: org.id,
      message: `Site imported (${input.mode}${input.dryRun ? ', dry run' : ''})`,
    });

    return {
      dryRun: false,
      mode: input.mode,
      preview: computePreview(site),
      counts: {
        settings: result.settings,
        pages: { created: result.pages.created, updated: result.pages.updated },
        sections: result.pages.sectionCount,
        menus: { created: result.menus.created, updated: result.menus.updated },
        menuItems: result.menus.itemCount,
        media: { uploaded: map.size, skipped: mediaWarnings.length },
        projects: { created: result.projects.created, updated: result.projects.updated },
        team: result.team,
        testimonials: result.testimonials,
        blogs: { created: result.blogs.created, updated: result.blogs.updated },
        events: { created: result.events.created, updated: result.events.updated },
        galleries: {
          created: result.galleries.created,
          updated: result.galleries.updated,
          items: result.galleries.itemCount,
        },
      },
      warnings,
    };
  },
};
