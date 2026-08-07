import { PublishStatus } from '@prisma/client';
import { prisma } from '../../../libs/prisma';
import type { SectionPatch } from '../page/schema';

export const websiteRepository = {
  async findBySlug(slug: string) {
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    return prisma.organization.findFirst({
      where: isId ? { OR: [{ slug }, { id: slug }] } : { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        email: true,
        phone: true,
        website: true,
        address: true,
        city: true,
        state: true,
        country: true,
        logoUrl: true,
        taxId: true,
        status: true,
        plan: true,
        assetsVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async getSettings(organizationId: string) {
    const rows = await prisma.organizationSetting.findMany({ where: { organizationId } });
    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return settings;
  },

  async getPages(organizationId: string) {
    return prisma.page.findMany({
      where: { organizationId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
      },
    });
  },

  async getPageBySlug(organizationId: string, slug: string) {
    return prisma.page.findFirst({
      where: { organizationId, slug },
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
      },
    });
  },

  async getSection(organizationId: string, sectionId: string) {
    return prisma.pageSection.findFirst({
      where: { id: sectionId, organizationId },
    });
  },

  async findSectionByType(pageId: string, type: string) {
    return prisma.pageSection.findFirst({
      where: { pageId, type },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async createSection(data: {
    pageId: string;
    organizationId: string;
    type: string;
    name?: string | null;
    sortOrder: number;
    isActive: boolean;
    settings?: Record<string, unknown>;
    content: Record<string, unknown>;
  }) {
    return prisma.pageSection.create({
      data: {
        pageId: data.pageId,
        organizationId: data.organizationId,
        type: data.type,
        name: data.name ?? null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        settings: (data.settings as never) ?? undefined,
        content: (data.content as never) ?? {},
      },
    });
  },

  async updateSection(
    sectionId: string,
    data: {
      type?: string;
      name?: string | null;
      sortOrder?: number;
      isActive?: boolean;
      settings?: Record<string, unknown> | null;
      content?: Record<string, unknown>;
    },
  ) {
    return prisma.pageSection.update({
      where: { id: sectionId },
      data: {
        type: data.type,
        name: data.name === undefined ? undefined : data.name,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        settings: data.settings === undefined ? undefined : (data.settings as never),
        content: data.content === undefined ? undefined : (data.content as never),
      },
    });
  },

  async deleteSection(sectionId: string) {
    return prisma.pageSection.delete({ where: { id: sectionId } });
  },

  async setPagePublished(organizationId: string, pageId: string) {
    return prisma.page.updateMany({
      where: { id: pageId, organizationId },
      data: { status: PublishStatus.PUBLISHED },
    });
  },

  async reorderSectionsByType(pageId: string, order: string[]) {
    return prisma.$transaction(async (tx) => {
      for (let index = 0; index < order.length; index++) {
        await tx.pageSection.updateMany({
          where: { pageId, type: order[index] },
          data: { sortOrder: index + 1 },
        });
      }
    });
  },

  async publishAll(organizationId: string, status: PublishStatus) {
    return prisma.page.updateMany({
      where: { organizationId },
      data: { status },
    });
  },

  async createDefaultSections(
    pageId: string,
    organizationId: string,
    sections: Array<{
      type: string;
      name?: string | null;
      sortOrder?: number;
      isActive?: boolean;
      settings?: Record<string, unknown>;
      content?: Record<string, unknown>;
    }>,
  ) {
    if (sections.length === 0) return 0;
    const created = await prisma.pageSection.createMany({
      data: sections.map((section, index) => ({
        pageId,
        organizationId,
        type: section.type,
        name: section.name ?? null,
        sortOrder: section.sortOrder ?? index + 1,
        isActive: section.isActive ?? true,
        settings: (section.settings ?? undefined) as never,
        content: (section.content ?? undefined) as never,
      })),
    });
    return created.count;
  },

  async replaceSections(pageId: string, organizationId: string, sections: SectionPatch[]) {
    await prisma.$transaction(async (tx) => {
      await tx.pageSection.deleteMany({ where: { pageId, organizationId } });
      if (sections.length > 0) {
        await tx.pageSection.createMany({
          data: sections.map((section) => ({
            id: section.id,
            pageId,
            organizationId,
            type: section.type,
            name: section.name ?? null,
            sortOrder: section.sortOrder ?? 0,
            isActive: section.isActive ?? true,
            settings: (section.settings ?? undefined) as never,
            content: (section.content ?? undefined) as never,
          })),
        });
      }
    });
    return sections.length;
  },

  async listTemplatesForOrg(organizationId: string) {
    return prisma.sectionTemplate.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  },
};
