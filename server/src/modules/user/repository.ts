import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export interface ListParams {
  skip: number;
  take: number;
  search?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  organizationId?: string;
  /** restrict to members of any of these organizations (platform admins) */
  organizationIds?: string[];
}

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  isMaster: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository = {
  async list(params: ListParams) {
    const where: Prisma.UserWhereInput = {
      ...(params.search
        ? {
            OR: [
              { firstName: { contains: params.search, mode: 'insensitive' } },
              { lastName: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(params.organizationId
        ? { memberships: { some: { organizationId: params.organizationId } } }
        : {}),
      ...(params.organizationIds && params.organizationIds.length > 0
        ? { memberships: { some: { organizationId: { in: params.organizationIds } } } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          ...userSelect,
          memberships: {
            select: {
              isCurrent: true,
              isActive: true,
              organization: { select: { id: true, slug: true, name: true } },
              role: { select: { key: true, name: true } },
            },
          },
          assignments: {
            select: {
              organization: { select: { id: true, slug: true, name: true } },
            },
          },
          roles: { select: { role: { select: { key: true, name: true } } } },
        },
        orderBy: { [params.sortBy]: params.sortOrder },
        skip: params.skip,
        take: params.take,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelect,
        memberships: {
          select: {
            id: true,
            isCurrent: true,
            isActive: true,
            organization: { select: { id: true, slug: true, name: true } },
            role: { select: { id: true, key: true, name: true } },
          },
        },
        roles: { select: { role: { select: { id: true, key: true, name: true } } } },
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: userSelect });
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, select: userSelect });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: userSelect });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async findMembership(organizationId: string, userId: string) {
    return prisma.organizationUser.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });
  },

  async assignOrg(organizationId: string, userId: string, roleId: string, isCurrent: boolean) {
    return prisma.organizationUser.upsert({
      where: { organizationId_userId: { organizationId, userId } },
      update: { roleId, isActive: true, isCurrent },
      create: { organizationId, userId, roleId, isActive: true, isCurrent },
    });
  },

  async removeFromOrg(organizationId: string, userId: string) {
    return prisma.organizationUser.delete({
      where: { organizationId_userId: { organizationId, userId } },
    });
  },

  async setCurrentOrg(userId: string, organizationId: string) {
    await prisma.organizationUser.updateMany({
      where: { userId, isCurrent: true },
      data: { isCurrent: false },
    });
    return prisma.organizationUser.updateMany({
      where: { userId, organizationId, isActive: true },
      data: { isCurrent: true },
    });
  },
};
