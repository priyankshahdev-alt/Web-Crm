import type { Prisma } from '@prisma/client';
import { prisma } from '../../../libs/prisma';
import { slugify } from '../factory';

interface GalleryItemInput {
  mediaId?: string | null;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  altText?: string | null;
  caption?: string | null;
  sortOrder?: number;
}

const include = {
  items: { orderBy: { sortOrder: 'asc' as const } },
  program: { select: { id: true, title: true, slug: true } },
  event: { select: { id: true, title: true, slug: true, startDate: true } },
};

const listInclude = {
  _count: { select: { items: true } },
  program: { select: { id: true, title: true, slug: true } },
  event: { select: { id: true, title: true, slug: true, startDate: true } },
};

/** Photo/video breakdown for the listed galleries (kept off the main query). */
async function attachMediaCounts(
  galleries: Array<{ id: string }>,
): Promise<Map<string, { photos: number; videos: number }>> {
  const ids = galleries.map((gallery) => gallery.id);
  if (ids.length === 0) return new Map();
  const grouped = await prisma.galleryItem.groupBy({
    by: ['galleryId', 'mediaType'],
    where: { galleryId: { in: ids } },
    _count: { _all: true },
  });
  const result = new Map<string, { photos: number; videos: number }>();
  for (const row of grouped) {
    const entry = result.get(row.galleryId) ?? { photos: 0, videos: 0 };
    if (row.mediaType === 'video') {
      entry.videos += row._count._all;
    } else {
      entry.photos += row._count._all;
    }
    result.set(row.galleryId, entry);
  }
  return result;
}

export const galleryRepository = {
  async list(organizationId: string, params: {
    skip: number;
    take: number;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    status?: string;
  }) {
    const where: Prisma.GalleryWhereInput = {
      organizationId,
      ...(params.search
        ? { OR: [
            { title: { contains: params.search, mode: 'insensitive' as const } },
            { description: { contains: params.search, mode: 'insensitive' as const } },
            { program: { title: { contains: params.search, mode: 'insensitive' as const } } },
            { event: { title: { contains: params.search, mode: 'insensitive' as const } } },
          ] }
        : {}),
      ...(params.status ? { status: params.status as Prisma.GalleryWhereInput['status'] } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { [params.sortBy]: params.sortOrder },
        skip: params.skip,
        take: params.take,
        include: listInclude,
      }),
      prisma.gallery.count({ where }),
    ]);
    const counts = await attachMediaCounts(items);
    return {
      items: items.map((gallery) => ({
        ...gallery,
        photos: counts.get(gallery.id)?.photos ?? 0,
        videos: counts.get(gallery.id)?.videos ?? 0,
      })),
      total,
    };
  },

  async findById(id: string) {
    return prisma.gallery.findUnique({ where: { id }, include });
  },

  async create(organizationId: string, data: Record<string, unknown>) {
    const { items, ...fields } = data;
    const payload = fields as Record<string, unknown>;
    if (!payload.slug && payload.title) {
      payload.slug = slugify(String(payload.title));
    }
    return prisma.gallery.create({
      data: {
        ...payload,
        organizationId,
        items: {
          create: (items as GalleryItemInput[] | undefined)?.map((item) => ({ ...item, organizationId })) ?? [],
        },
      } as Prisma.GalleryUncheckedCreateInput,
      include,
    });
  },

  async update(id: string, data: Record<string, unknown>) {
    const { items, ...fields } = data;
    const existing = await prisma.gallery.findUnique({ where: { id }, select: { organizationId: true } });
    if (!existing) return null;
    const payload = fields as Record<string, unknown>;
    return prisma.gallery.update({
      where: { id },
      data: {
        ...payload,
        items: items
          ? {
              deleteMany: {},
              create: (items as GalleryItemInput[]).map((item) => ({ ...item, organizationId: existing.organizationId })),
            }
          : undefined,
      },
      include,
    });
  },

  async remove(id: string) {
    return prisma.gallery.delete({ where: { id } });
  },
};
