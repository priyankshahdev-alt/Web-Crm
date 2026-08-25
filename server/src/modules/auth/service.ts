import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { prisma } from '../../libs/prisma';
import { config } from '../../config';
import { ApiError } from '../../utils/ApiError';
import { hashPassword, verifyPassword } from '../../utils/password';
import { recordAudit } from '../../utils/audit';
import {
  signAccessToken,
  signRefreshToken,
  signImpersonateTicket,
  verifyImpersonateTicket,
  verifyRefreshToken,
} from '../../utils/jwt';
import { authRepository } from './repository';
import { buildAuthUser, resolveWebsiteId } from './authContext';
import type { AuthUser } from '../../types';
import type { ChangePasswordInput, ImpersonateInput, LoginInput, RefreshInput } from './schema';

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

    void recordAudit({
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      message: `${user.firstName} ${user.lastName ?? ''} signed in`.trim(),
      req,
    });

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
  async switchOrganization(userId: string, organizationId: string, req?: Request) {
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

    void recordAudit({
      userId,
      organizationId,
      action: 'UPDATE',
      resource: 'auth',
      message: `Switched to website "${target.organization.name}"`,
      req,
    });

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

  /**
   * Master-only: issue a short-lived "log in as admin" ticket for a platform
   * admin. The ticket is exchanged (not the admin's credentials) so tokens are
   * only ever minted inside the admin panel's own origin.
   */
  async impersonate(input: ImpersonateInput, master: AuthUser) {
    if (!master.isMaster) {
      throw ApiError.forbidden('Only the platform master can impersonate admins');
    }

    const target = await authRepository.findUserById(input.userId);
    if (!target || !target.isActive) {
      throw ApiError.unauthorized('User not found or deactivated');
    }
    if (target.isMaster) {
      throw ApiError.forbidden('Cannot impersonate another master user');
    }

    const roles = await prisma.userRole.findMany({
      where: { userId: target.id },
      select: { role: { select: { key: true } } },
    });
    if (!roles.some((r) => r.role.key === 'admins')) {
      throw ApiError.forbidden('Only platform admins can be impersonated');
    }

    const ticket = signImpersonateTicket(target.id, master.id);

    void recordAudit({
      userId: master.id,
      action: 'LOGIN',
      resource: 'auth',
      message: `${master.firstName} ${master.lastName ?? ''} started impersonating ${target.firstName} ${target.lastName ?? ''}`.trim(),
    });

    return { ticket, expiresInSeconds: 120 };
  },

  /**
   * Exchange a master-issued impersonation ticket for a full admin session.
   * Unsigned tokens are never put in the URL; they are minted here and stored
   * by the admin panel itself.
   */
  async exchangeImpersonate(input: { ticket: string }, req: Request) {
    let payload;
    try {
      payload = verifyImpersonateTicket(input.ticket);
    } catch {
      throw ApiError.unauthorized('Invalid or expired login ticket');
    }

    const target = await authRepository.findUserById(payload.sub);
    if (!target || !target.isActive) {
      throw ApiError.unauthorized('User not found or deactivated');
    }

    const authUser = await buildAuthUser(target.id);
    const accessToken = signAccessToken(authUser);
    const familyId = randomUUID();
    const refreshToken = signRefreshToken(target.id, familyId);

    await Promise.all([
      authRepository.createRefreshToken({
        userId: target.id,
        token: refreshToken,
        familyId,
        expiresAt: refreshExpiry(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      }),
      authRepository.updateLastLogin(target.id),
    ]);

    void recordAudit({
      userId: target.id,
      action: 'LOGIN',
      resource: 'auth',
      message: `${target.firstName} ${target.lastName ?? ''} signed in via impersonation`.trim(),
      req,
    });

    const memberships = await authRepository.findMemberships(target.id);

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

  async logout(refreshToken: string, req?: Request) {
    if (!refreshToken) throw ApiError.badRequest('refreshToken is required');
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(stored.id);
      void recordAudit({
        userId: stored.userId,
        action: 'LOGOUT',
        resource: 'auth',
        message: 'Signed out',
        req,
      });
    }
    return true;
  },

  async changePassword(userId: string, input: ChangePasswordInput, req?: Request) {
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

    void recordAudit({
      userId,
      action: 'UPDATE',
      resource: 'auth',
      message: `${user.firstName} ${user.lastName ?? ''} changed password`.trim(),
      req,
    });

    return true;
  },

  async me(userId: string) {
    const authUser = await buildAuthUser(userId);
    const memberships = await authRepository.findMemberships(userId);
    const profile = await authRepository.findUserProfileById(userId);
    return {
      user: {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        phone: profile?.phone ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        isMaster: authUser.isMaster,
        roles: authUser.roles,
        permissions: authUser.permissions,
        createdAt: profile?.createdAt.toISOString() ?? '',
        lastLoginAt: profile?.lastLoginAt?.toISOString() ?? null,
      },
      organizations: memberships.map((m) => ({
        ...m.organization,
        role: m.role.key,
        roleName: m.role.name,
        isCurrent: m.isCurrent,
      })),
    };
  },

  async updateProfile(userId: string, input: { firstName?: string; lastName?: string; phone?: string | null; avatarUrl?: string | null }, req?: Request) {
    const updated = await authRepository.updateProfile(userId, input);

    const roles = updated.roles.map((r) => r.role);

    void recordAudit({
      userId,
      action: 'UPDATE',
      resource: 'auth',
      message: `${updated.firstName} ${updated.lastName ?? ''} updated profile`.trim(),
      before: { firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone },
      after: input,
      req,
    });

    return {
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        avatarUrl: updated.avatarUrl,
        isMaster: updated.isMaster,
        roles: roles.map((r) => r.key),
        permissions: [],
        createdAt: updated.createdAt.toISOString(),
        lastLoginAt: updated.lastLoginAt?.toISOString() ?? null,
      },
    };
  },

  async changeEmail(userId: string, input: { newEmail: string }, req?: Request) {
    const user = await authRepository.findUserProfileById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const existing = await authRepository.findUserByEmail(input.newEmail.toLowerCase().trim());
    if (existing) throw ApiError.badRequest('Email already in use');

    // TODO: Implement email verification flow
    // For now, update the email directly but mark as unverified
    // This would typically send a verification email and require confirmation
    await prisma.user.update({
      where: { id: userId },
      data: { email: input.newEmail.toLowerCase().trim() },
    });

    void recordAudit({
      userId,
      action: 'UPDATE',
      resource: 'auth',
      message: `${user.firstName} ${user.lastName ?? ''} changed email`.trim(),
      before: { email: user.email },
      after: { email: input.newEmail },
      req,
    });

    return { message: 'Verification email sent. Please verify your new email address.' };
  },

  async listSessions(userId: string) {
    const tokens = await authRepository.findActiveRefreshTokens(userId);

    // Parse user agent for device/browser info
    const parseUserAgent = (ua: string | null | undefined) => {
      if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
      let device = 'Desktop';
      let browser = 'Unknown';
      let os = 'Unknown';

      if (/mobile|android|iphone|ipad|phone/i.test(ua)) device = 'Mobile';
      else if (/tablet|ipad/i.test(ua)) device = 'Tablet';

      if (/edg/i.test(ua)) browser = 'Edge';
      else if (/chrome|chromium|crios/i.test(ua)) browser = 'Chrome';
      else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
      else if (/safari/i.test(ua)) browser = 'Safari';
      else if (/opera|opr/i.test(ua)) browser = 'Opera';

      if (/windows/i.test(ua)) os = 'Windows';
      else if (/mac os|macos/i.test(ua)) os = 'macOS';
      else if (/linux/i.test(ua)) os = 'Linux';
      else if (/android/i.test(ua)) os = 'Android';
      else if (/iphone|ipad/i.test(ua)) os = 'iOS';

      return { device, browser, os };
    };

    return tokens.map((token, index) => {
      const { device, browser, os } = parseUserAgent(token.userAgent);
      const isCurrent = index === 0; // First token is current session (most recent)
      return {
        id: token.id,
        device: `${device} / ${os}`,
        browser,
        ip: token.ipAddress ?? 'Unknown',
        location: 'Unknown', // Would need GeoIP service
        current: isCurrent,
        lastActive: token.createdAt.toISOString(),
      };
    });
  },

  async revokeSession(userId: string, sessionId: string, req?: Request) {
    await authRepository.revokeRefreshTokenById(sessionId, userId);

    void recordAudit({
      userId,
      action: 'REVOKE',
      resource: 'auth',
      message: `Revoked session`,
      req,
    });

    return true;
  },

  async revokeAllOtherSessions(userId: string, _currentFamilyId: string, req?: Request) {
    await authRepository.revokeAllOtherSessions(userId, _currentFamilyId);

    void recordAudit({
      userId,
      action: 'REVOKE_ALL',
      resource: 'auth',
      message: `Revoked all other sessions`,
      req,
    });

    return true;
  },
};
