import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export interface ListParams {
  organizationId: string;
  skip: number;
  take: number;
  entityType?: string;
  entityId?: string;
  mimeType?: string;
  folder?: string;
  search?: string;
}

export interface CreateMediaInput {
  organizationId: string;
  fileName: string;
  mimeType: string;
  size: number;
  bucket: string;
  key: string;
  url: string;
  thumbnailUrl?: string;
  entityType?: string;
  entityId?: string;
  folder?: string;
  uploadedById?: string;
}

export const mediaRepository = {
  async list(params: ListParams) {
    const where: Prisma.MediaWhereInput = {
      organizationId: params.organizationId,
      ...(params.entityType ? { entityType: params.entityType } : {}),
      ...(params.entityId ? { entityId: params.entityId } : {}),
      ...(params.mimeType ? { mimeType: params.mimeType } : {}),
      ...(params.folder ? { folder: params.folder } : {}),
      ...(params.search
        ? { fileName: { contains: params.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      prisma.media.count({ where }),
    ]);

    return { items, total };
  },

  async create(input: CreateMediaInput) {
    return prisma.media.create({
      data: {
        organizationId: input.organizationId,
        fileName: input.fileName,
        mimeType: input.mimeType,
        size: input.size,
        bucket: input.bucket,
        key: input.key,
        url: input.url,
        thumbnailUrl: input.thumbnailUrl ?? null,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        folder: input.folder ?? null,
        uploadedById: input.uploadedById ?? null,
      },
    });
  },

  async findById(id: string) {
    return prisma.media.findUnique({ where: { id } });
  },

  async update(id: string, data: Prisma.MediaUpdateInput) {
    return prisma.media.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.media.delete({ where: { id } });
  },
};
