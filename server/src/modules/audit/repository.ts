import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export interface ListParams {
  organizationId?: string;
  skip: number;
  take: number;
  action?: string;
  resource?: string;
  userId?: string;
  search?: string;
  from?: Date;
  to?: Date;
}

export const auditRepository = {
  async list(params: ListParams) {
    const AND: Prisma.AuditLogWhereInput[] = [];

    if (params.organizationId) {
      AND.push({ organizationId: params.organizationId });
    }
    if (params.action) {
      AND.push({ action: params.action });
    }
    if (params.resource) {
      AND.push({ resource: params.resource });
    }
    if (params.userId) {
      AND.push({ userId: params.userId });
    }
    if (params.from || params.to) {
      AND.push({
        createdAt: {
          ...(params.from ? { gte: params.from } : {}),
          ...(params.to ? { lte: params.to } : {}),
        },
      });
    }
    if (params.search) {
      const term = params.search.trim();
      AND.push({
        OR: [
          { message: { contains: term, mode: 'insensitive' } },
          { action: { contains: term, mode: 'insensitive' } },
          { resource: { contains: term, mode: 'insensitive' } },
          { user: { firstName: { contains: term, mode: 'insensitive' } } },
          { user: { lastName: { contains: term, mode: 'insensitive' } } },
          { user: { email: { contains: term, mode: 'insensitive' } } },
        ],
      });
    }

    const where: Prisma.AuditLogWhereInput = AND.length ? { AND } : {};

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true } },
          organization: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  },
};
