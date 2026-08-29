import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient, PublishStatus, SectionTemplateScope, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const ORG_SLUG = 'mann';
const CONTENT_DIR = path.join(__dirname, 'data', 'mann-content');
const NAV_FILE = path.join(__dirname, 'data', 'mann-nav.json');
const FOOTER_FILE = path.join(__dirname, 'data', 'mann-footer.json');

// Generic template pages that are not part of the live Mann Care route map.
// They get removed (if present) so the CMS mirrors the actual website only.
const GENERIC_SLUGS = ['projects', 'gallery', 'documents', 'faq', 'terms', 'about', 'contact', 'donate'];

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function isUrl(value: string): boolean {
  return /^https?:\/\/|^\/|^\w+\//.test(value);
}

function inferFields(content: Record<string, unknown>): Record<string, unknown>[] {
  return Object.entries(content ?? {}).map(([name, value]) => {
    const label = humanize(name);
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { name, label, type: 'list', itemType: 'string', maxItems: 100 };
      }
      const first = value[0];
      if (typeof first === 'string') {
        return { name, label, type: 'list', itemType: 'string', maxItems: 100 };
      }
      if (typeof first === 'number') {
        return { name, label, type: 'list', itemType: 'number', maxItems: 100 };
      }
      if (typeof first === 'object' && first !== null) {
        const merged: Record<string, unknown> = {};
        for (const item of value) {
          if (item && typeof item === 'object') {
            Object.assign(merged, item as Record<string, unknown>);
          }
        }
        return {
          name,
          label,
          type: 'repeater',
          minItems: 0,
          maxItems: 100,
          fields: inferFields(merged),
        };
      }
      return { name, label, type: 'list', itemType: 'string', maxItems: 100 };
    }
    if (typeof value === 'object' && value !== null) {
      return { name, label, type: 'group', fields: inferFields(value as Record<string, unknown>) };
    }
    if (typeof value === 'number') return { name, label, type: 'number' };
    if (typeof value === 'boolean') return { name, label, type: 'boolean' };
    if (typeof value === 'string') {
      if (isUrl(value)) return { name, label, type: 'url', maxLength: 1000 };
      return { name, label, type: value.length > 300 ? 'textarea' : 'text', maxLength: Math.max(100, value.length + 200) };
    }
    return { name, label, type: 'text', maxLength: 300 };
  });
}

type SectionSpec = {
  type: string;
  name?: string;
  sortOrder?: number;
  isActive?: boolean;
  settings?: Record<string, unknown>;
  content: Record<string, unknown>;
};

type PageFile = {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  template?: string;
  sortOrder?: number;
  isHome?: boolean;
  sections: SectionSpec[];
};

async function upsertSectionTemplates(orgId: string, pages: PageFile[]): Promise<void> {
  for (const page of pages) {
    for (const section of page.sections) {
      const fields = inferFields(section.content ?? {});
      const existing = await prisma.sectionTemplate.findUnique({
        where: { organizationId_type: { organizationId: orgId, type: section.type } },
      });
      const data = {
        type: section.type,
        name: section.name ?? humanize(section.type),
        label: section.name ?? humanize(section.type),
        description: `Section template for "${section.type}" on the Mann Care website.`,
        scope: SectionTemplateScope.ORGANIZATION,
        isSystem: false,
        fields: fields as Prisma.InputJsonValue,
      };
      if (existing) {
        await prisma.sectionTemplate.update({ where: { id: existing.id }, data });
      } else {
        await prisma.sectionTemplate.create({ data: { ...data, organizationId: orgId } });
      }
    }
  }
}

async function upsertPages(orgId: string, pages: PageFile[]): Promise<Set<string>> {
  const seen = new Set<string>();
  for (const page of pages) {
    seen.add(page.slug);
    const existing = await prisma.page.findUnique({
      where: { organizationId_slug: { organizationId: orgId, slug: page.slug } },
    });
    const pageData = {
      title: page.title,
      metaTitle: page.metaTitle ?? page.title,
      metaDescription: page.metaDescription ?? null,
      status: PublishStatus.PUBLISHED,
      template: page.template ?? 'default',
      sortOrder: page.sortOrder ?? 99,
      isHome: page.isHome ?? false,
    };
    let pageId: string;
    if (existing) {
      await prisma.page.update({ where: { id: existing.id }, data: pageData });
      pageId = existing.id;
    } else {
      const created = await prisma.page.create({
        data: { organizationId: orgId, slug: page.slug, ...pageData },
      });
      pageId = created.id;
    }

    await prisma.pageSection.deleteMany({ where: { pageId } });
    const sections = (page.sections ?? []).map((s, i) => ({
      pageId,
      organizationId: orgId,
      type: s.type,
      name: s.name ?? humanize(s.type),
      sortOrder: s.sortOrder ?? i + 1,
      isActive: s.isActive ?? true,
      settings: (s.settings ?? {}) as Prisma.InputJsonValue,
      content: (s.content ?? {}) as Prisma.InputJsonValue,
    }));
    if (sections.length > 0) {
      await prisma.pageSection.createMany({ data: sections });
    }
  }
  return seen;
}

async function seedMenu(
  orgId: string,
  file: string,
  location: string,
  name: string,
): Promise<void> {
  let nav: { label: string; url?: string; children?: { label: string; url: string }[] }[];
  try {
    nav = JSON.parse(readFileSync(file, 'utf8')) as typeof nav;
  } catch {
    console.warn(`Menu file missing (${file}) — skipping "${location}" seed.`);
    return;
  }

  const menu = await prisma.menu.upsert({
    where: { organizationId_location: { organizationId: orgId, location } },
    update: { name },
    create: { organizationId: orgId, name, location },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });

  for (const [i, item] of nav.entries()) {
    const parent = await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        organizationId: orgId,
        label: item.label,
        url: item.url ?? null,
        sortOrder: i + 1,
        isActive: true,
      },
    });
    if (item.children) {
      for (const [j, child] of item.children.entries()) {
        await prisma.menuItem.create({
          data: {
            menuId: menu.id,
            organizationId: orgId,
            parentId: parent.id,
            label: child.label,
            url: child.url,
            sortOrder: j + 1,
            isActive: true,
          },
        });
      }
    }
  }
}

async function main(): Promise<void> {
  const org = await prisma.organization.findUnique({ where: { slug: ORG_SLUG } });
  if (!org) {
    throw new Error(`Organization "${ORG_SLUG}" not found. Run "npm run db:seed" first.`);
  }
  console.log(`Seeding website content for "${ORG_SLUG}"...`);

  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json')).sort();
  const pages: PageFile[] = [];
  for (const file of files) {
    try {
      const parsed = JSON.parse(readFileSync(path.join(CONTENT_DIR, file), 'utf8')) as PageFile;
      if (!parsed.slug || !Array.isArray(parsed.sections)) {
        console.warn(`Skipping ${file}: missing slug or sections.`);
        continue;
      }
      pages.push(parsed);
    } catch (e) {
      console.warn(`Skipping ${file}: invalid JSON (${(e as Error).message}).`);
    }
  }
  console.log(`Loaded ${pages.length} page content files.`);

  await upsertSectionTemplates(org.id, pages);
  const seeded = await upsertPages(org.id, pages);
  await seedMenu(org.id, NAV_FILE, 'main-nav', 'Main Navigation');
  await seedMenu(org.id, FOOTER_FILE, 'footer-nav', 'Footer Navigation');

  const generic = GENERIC_SLUGS.filter((slug) => !seeded.has(slug));
  if (generic.length > 0) {
    const { count } = await prisma.page.deleteMany({
      where: { organizationId: org.id, slug: { in: generic } },
    });
    if (count > 0) console.log(`Removed ${count} generic template pages.`);
  }

  console.log(`Website content seeded: ${seeded.size} pages, ${pages.reduce((n, p) => n + p.sections.length, 0)} sections.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
