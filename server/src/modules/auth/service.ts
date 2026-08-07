import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { config } from '../../config';
import { ApiError } from '../../utils/ApiError';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { authRepository } from './repository';
import { buildAuthUser, resolveWebsiteId } from './authContext';
import type { AuthUser } from '../../types';
import type { ChangePasswordInput, LoginInput, RefreshInput } from './schema';

function addSeconds(seconds: string): Date {
  const match = seconds.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const [, num, unit] = match;
  const n = Number(num);
  const msPerUnit: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return new Date(Date.now() + n * (msPerUnit[unit] ?? 0));
}

function refreshExpiry(): Date {
  return addSeconds(config.jwt.refreshExpires);
}

export const authService = {
  async login(input: LoginInput, req: Request) {
    const email = input.email.toLowerCase().trim();
    const user = await authRepository.findLoginUser(email);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const permissions = new Set<string>(user.permissions.map((p) => p.permission.code));
    for (const role of user.roles) {
      for (const rp of role.role.permissions) {
        permissions.add(rp.permission.code);
      }
    }
    const memberships = user.memberships.filter((m) => m.isActive);
    for (const membership of memberships) {
      for (const rp of membership.role.permissions) {
        permissions.add(rp.permission.code);
      }
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isMaster: user.isMaster,
      roles: user.roles.map((r) => r.role.key),
      permissions: Array.from(permissions),
      websiteId: resolveWebsiteId(user.memberships),
    };

    const accessToken = signAccessToken(authUser);
    const familyId = randomUUID();
    const refreshToken = signRefreshToken(user.id, familyId);

    await Promise.all([
      authRepository.createRefreshToken({
        userId: user.id,
        token: refreshToken,
        familyId,
        expiresAt: refreshExpiry(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      }),
      authRepository.updateLastLogin(user.id),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        isMaster: authUser.isMaster,
        roles: authUser.roles,
      },
      organizations: memberships.map((m) => ({
        ...m.organization,
        role: m.role.key,
        roleName: m.role.name,
        isCurrent: m.isCurrent,
      })),
    };
  },

  async refresh(input: RefreshInput, req: Request) {
    const stored = await authRepository.findRefreshToken(input.refreshToken);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    let payload;
    try {
      payload = verifyRefreshToken(input.refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const dbUser = await authRepository.findUserById(payload.sub);
    if (!dbUser || !dbUser.isActive) {
      throw ApiError.unauthorized('User not found or deactivated');
    }

    const newRefresh = signRefreshToken(dbUser.id, stored.familyId);
    const newStored = await authRepository.createRefreshToken({
      userId: dbUser.id,
      token: newRefresh,
      familyId: stored.familyId,
      expiresAt: refreshExpiry(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    await authRepository.revokeRefreshToken(stored.id, newStored.id);
    await authRepository.revokeFamily(stored.familyId, stored.id);

    const authUser = await buildAuthUser(dbUser.id);
    const accessToken = signAccessToken(authUser);

    return { accessToken, refreshToken: newRefresh };
  },

  /**
   * Re-scope an authenticated user to one of their active organizations.
   * Persists the selection (isCurrent) so it also survives token refresh and
   * future logins, then issues a fresh access token carrying the new websiteId.
   */
  async switchOrganization(userId: string, organizationId: string) {
    const memberships = await authRepository.findMemberships(userId);
    const target = memberships.find((m) => m.organization.id === organizationId);
    if (!target) {
      throw ApiError.forbidden('No access to this website');
    }
    if (target.organization.status !== 'ACTIVE') {
      throw ApiError.forbidden('This website is not active');
    }

    await authRepository.setCurrentMembership(userId, organizationId);

    const authUser = await buildAuthUser(userId);
    authUser.websiteId = organizationId;
    const accessToken = signAccessToken(authUser);

    return {
      accessToken,
      user: {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        isMaster: authUser.isMaster,
        roles: authUser.roles,
      },
      organization: {
        ...target.organization,
        role: target.role.key,
        roleName: target.role.name,
        isCurrent: true,
      },
    };
  },

  async logout(refreshToken: string) {    if (!refreshToken) throw ApiError.badRequest('refreshToken is required');
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(stored.id);
    }
    return true;
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const valid = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!valid) throw ApiError.badRequest('Current password is incorrect');

    const passwordHash = await hashPassword(input.newPassword);
    await authRepository.changePassword(user.id, passwordHash);

    const families = await authRepository.findActiveRefreshFamilies(user.id);
    for (const family of families) {
      await authRepository.revokeFamily(family.familyId);
    }

    return true;
  },

  async me(userId: string) {
    const authUser = await buildAuthUser(userId);
    const memberships = await authRepository.findMemberships(userId);
    return {
      user: {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        isMaster: authUser.isMaster,
        roles: authUser.roles,
        permissions: authUser.permissions,
      },
      organizations: memberships.map((m) => ({
        ...m.organization,
        role: m.role.key,
        roleName: m.role.name,
        isCurrent: m.isCurrent,
      })),
    };
  },
};
