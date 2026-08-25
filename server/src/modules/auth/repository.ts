import { createHash, randomUUID } from 'node:crypto';
import { prisma } from '../../libs/prisma';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export interface CreateRefreshTokenInput {
  userId: string;
  token: string;
  familyId?: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export const authRepository = {
  /**
   * Single query used at login: user + platform roles/permissions +
   * active memberships. Lets the login handler compute the full auth
   * context and session response without extra round trips.
   */
  async findLoginUser(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        isMaster: true,
        isActive: true,
        roles: {
          select: {
            role: {
              select: {
                key: true,
                permissions: { select: { permission: { select: { code: true } } } },
              },
            },
          },
        },
        memberships: {
          select: {
            isCurrent: true,
            isActive: true,
            organization: { select: { id: true, slug: true, name: true, logoUrl: true, website: true, status: true } },
            role: {
              select: {
                key: true,
                name: true,
                permissions: { select: { permission: { select: { code: true } } } },
              },
            },
          },
        },
        permissions: { select: { permission: { select: { code: true } } } },
      },
    });
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        isMaster: true,
        isActive: true,
      },
    });
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        isMaster: true,
        isActive: true,
      },
    });
  },

  async findUserProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
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
        roles: {
          select: {
            role: {
              select: { key: true, name: true },
            },
          },
        },
      },
    });
  },

  async updateProfile(id: string, data: { firstName?: string; lastName?: string; phone?: string | null; avatarUrl?: string | null }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
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
        roles: {
          select: {
            role: { select: { key: true, name: true } },
          },
        },
      },
    });
  },

  async findActiveRefreshTokens(userId: string) {
    return prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
      select: {
        id: true,
        familyId: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async revokeRefreshTokenById(id: string, userId: string) {
    return prisma.refreshToken.updateMany({
      where: { id, userId },
      data: { revokedAt: new Date() },
    });
  },

  async revokeAllOtherSessions(userId: string, exceptFamilyId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null, NOT: { familyId: exceptFamilyId } },
      data: { revokedAt: new Date() },
    });
  },

  async findActiveRefreshFamilies(userId: string) {
    return prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
      select: { familyId: true },
      distinct: ['familyId'],
    });
  },

  async findMemberships(userId: string) {
    return prisma.organizationUser.findMany({
      where: { userId, isActive: true },
      select: {
        isCurrent: true,
        organization: {
          select: { id: true, slug: true, name: true, logoUrl: true, website: true, status: true },
        },
        role: { select: { key: true, name: true } },
      },
    });
  },

  async createRefreshToken(input: CreateRefreshTokenInput) {
    return prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: hashToken(input.token),
        familyId: input.familyId ?? randomUUID(),
        expiresAt: input.expiresAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  },

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
  },

  async revokeRefreshToken(id: string, replacedById?: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date(), replacedById: replacedById ?? null },
    });
  },

  async revokeFamily(familyId: string, exceptId?: string) {
    return prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null, NOT: exceptId ? { id: exceptId } : undefined },
      data: { revokedAt: new Date() },
    });
  },

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  },

  async changePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  /**
   * Mark a single active membership as the user's current organization and
   * clear the flag on the others, inside one transaction.
   */
  async setCurrentMembership(userId: string, organizationId: string) {
    return prisma.$transaction([
      prisma.organizationUser.updateMany({
        where: { userId, isActive: true },
        data: { isCurrent: false },
      }),
      prisma.organizationUser.updateMany({
        where: { userId, organizationId, isActive: true },
        data: { isCurrent: true },
      }),
    ]);
  },
};
