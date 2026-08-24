import type { Prisma } from '@prisma/client';
import { prisma } from '../../../libs/prisma';
import { slugify } from '../factory';
export interface ProjectChildInput {
  images?: { imageUrl: string; altText?: string | null; sortOrder?: number }[];
  services?: { title: string; description?: string | null; icon?: string | null; imageUrl?: string | null; sortOrder?: number }[];
  impacts?: { title: string; description?: string | null; icon?: string | null; sortOrder?: number }[];
  stats?: { label: string; value: string; sortOrder?: number }[];
}

const childrenPayload = (orgId: string, children: ProjectChildInput) => ({
  images: children.images?.map((c) => ({ organizationId: orgId, ...c })) ?? [],
  services: children.services?.map((c) => ({ organizationId: orgId, ...c })) ?? [],
  impacts: children.impacts?.map((c) => ({ organizationId: orgId, ...c })) ?? [],
  stats: children.stats?.map((c) => ({ organizationId: orgId, ...c })) ?? [],
});

const include = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  services: { orderBy: { sortOrder: 'asc' as const } },
  impacts: { orderBy: { sortOrder: 'asc' as const } },
  stats: { orderBy: { sortOrder: 'asc' as const } },
};

export const projectRepository = {
  async list(organizationId: string, params: {
    skip: number;
    take: number;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    status?: string;
    featured?: string;
  }) {
    const where: Prisma.ProjectWhereInput = {
      organizationId,
      ...(params.search
        ? { OR: [
            { title: { contains: params.search, mode: 'insensitive' as const } },
            { summary: { contains: params.search, mode: 'insensitive' as const } },
            { tag: { contains: params.search, mode: 'insensitive' as const } },
          ] }
        : {}),
      ...(params.status ? { status: params.status as Prisma.ProjectWhereInput['status'] } : {}),
      ...(params.featured ? { featured: params.featured === 'true' } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { [params.sortBy]: params.sortOrder },
        skip: params.skip,
        take: params.take,
        include: {
          _count: { select: { beneficiaries: true, images: true, stats: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);
    return { items, total };
  },

  async findById(id: string) {
    return prisma.project.findUnique({ where: { id }, include });
  },

  async create(organizationId: string, data: Record<string, unknown>) {
    const { images, services, impacts, stats, ...fields } = data;
    const payload = fields as Record<string, unknown>;
    if (!payload.slug && payload.title) {
      payload.slug = slugify(String(payload.title));
    }
    const children = childrenPayload(organizationId, { images, services, impacts, stats } as ProjectChildInput);
    return prisma.project.create({
      data: {
        ...payload,
        organizationId,
        images: { create: children.images },
        services: { create: children.services },
        impacts: { create: children.impacts },
        stats: { create: children.stats },
      } as unknown as Prisma.ProjectUncheckedCreateInput,
      include,
    });
  },

  async update(id: string, data: Record<string, unknown>) {
    const { images, services, impacts, stats, ...fields } = data;
    const existing = await prisma.project.findUnique({ where: { id }, select: { organizationId: true } });
    if (!existing) return null;
    const children = childrenPayload(existing.organizationId, { images, services, impacts, stats } as ProjectChildInput);
    const payload = fields as Record<string, unknown>;
    return prisma.project.update({
      where: { id },
      data: {
        ...payload,
        images: images ? { deleteMany: {}, create: children.images } : undefined,
        services: services ? { deleteMany: {}, create: children.services } : undefined,
        impacts: impacts ? { deleteMany: {}, create: children.impacts } : undefined,
        stats: stats ? { deleteMany: {}, create: children.stats } : undefined,
      },
      include,
    });
  },

  async remove(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
