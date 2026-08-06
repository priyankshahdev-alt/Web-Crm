import { Prisma, PublishStatus } from '@prisma/client';
import { prisma } from '../../../libs/prisma';
import type { SectionPatch } from './schema';

export interface ListParams {
  organizationId: string;
  skip: number;
  take: number;
  search?: string;
  status?: PublishStatus;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const pageRepository = {
  async list(params: ListParams) {
    const where: Prisma.PageWhereInput = {
      organizationId: params.organizationId,
      ...(params.search
        ? {
            OR: [
              { title: { contains: params.search, mode: 'insensitive' } },
              { slug: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { [params.sortBy]: params.sortOrder }],
        skip: params.skip,
        take: params.take,
        include: { _count: { select: { sections: true } } },
      }),
      prisma.page.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string) {
    return prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async findByIdInOrg(id: string, organizationId: string) {
    return prisma.page.findFirst({
      where: { id, organizationId },
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
      },
    });
  },

  async findBySlugInOrg(slug: string, organizationId: string) {
    return prisma.page.findFirst({ where: { slug, organizationId } });
  },

  async create(data: Prisma.PageUncheckedCreateInput) {
    return prisma.page.create({ data });
  },

  async update(id: string, data: Prisma.PageUpdateInput) {
    return prisma.page.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.page.delete({ where: { id } });
  },

  async findSection(sectionId: string, organizationId: string) {
    return prisma.pageSection.findFirst({
      where: { id: sectionId, organizationId },
    });
  },

  async createSection(data: Prisma.PageSectionUncheckedCreateInput) {
    return prisma.pageSection.create({ data });
  },

  async updateSection(id: string, data: Prisma.PageSectionUpdateInput) {
    return prisma.pageSection.update({ where: { id }, data });
  },

  async deleteSection(id: string) {
    return prisma.pageSection.delete({ where: { id } });
  },

  async updateSectionOrder(organizationId: string, orderedIds: string[]) {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.pageSection.updateMany({
          where: { id, organizationId },
          data: { sortOrder: index + 1 },
        }),
      ),
    );
    return orderedIds;
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
};
