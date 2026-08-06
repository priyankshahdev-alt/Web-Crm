import { prisma } from '../../libs/prisma';
import { ApiError } from '../../utils/ApiError';
import type { AuthUser } from '../../types';

export interface MembershipSiteRef {
  isCurrent: boolean;
  isActive: boolean;
  organization: { id: string };
}

/**
 * Resolve the single website a user is scoped to. A user is a website user
 * only when they have exactly one active membership (or one marked current);
 * anything else is ambiguous and yields no website scope.
 */
export function resolveWebsiteId(memberships: MembershipSiteRef[]): string | null {
  const active = memberships.filter((m) => m.isActive);
  if (active.length === 0) return null;
  const current = active.find((m) => m.isCurrent);
  if (current) return current.organization.id;
  if (active.length === 1) return active[0].organization.id;
  return null;
}

/**
 * Build an AuthUser from DB with union of permissions across all memberships
 * and platform roles. Used when issuing access tokens.
 */
export async function buildAuthUser(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
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
          organization: { select: { id: true } },
          role: {
            select: {
              permissions: { select: { permission: { select: { code: true } } } },
            },
          },
        },
      },
      permissions: { select: { permission: { select: { code: true } } } },
    },
  });

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or deactivated');
  }

  const permissions = new Set<string>(user.permissions.map((p) => p.permission.code));
  for (const role of user.roles) {
    for (const rp of role.role.permissions) {
      permissions.add(rp.permission.code);
    }
  }
  for (const membership of user.memberships) {
    if (!membership.isActive) continue;
    for (const rp of membership.role.permissions) {
      permissions.add(rp.permission.code);
    }
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isMaster: user.isMaster,
    roles: user.roles.map((r) => r.role.key),
    permissions: Array.from(permissions),
    websiteId: resolveWebsiteId(user.memberships),
  };
}
