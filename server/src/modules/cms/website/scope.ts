import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { prisma } from '../../../libs/prisma';
import { ApiError } from '../../../utils/ApiError';
import type { ActiveOrg } from '../../../types';

/**
 * Resolve the website (organization) from the `:slug` path parameter and scope
 * the request to it. Mirrors `orgScope` semantics but keyed by site slug so the
 * Website User CMS can address sites by their public slug.
 */
export function websiteScope(required = true): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) return next(ApiError.unauthorized());

      const slug = req.params.slug;
      if (!slug) {
        return required ? next(ApiError.badRequest('Website slug is required')) : next();
      }

      const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      const org = await prisma.organization.findFirst({
        where: isId ? { OR: [{ slug }, { id: slug }] } : { slug },
        select: { id: true, slug: true, name: true, status: true },
      });

      if (!org || org.status !== 'ACTIVE') {
        return required ? next(ApiError.notFound('Website not found')) : next();
      }

      if (req.user.isMaster) {
        req.activeOrg = org as ActiveOrg;
        return next();
      }

      if (req.user.roles.includes('admins')) {
        const assignment = await prisma.organizationAssignment.findUnique({
          where: {
            organizationId_userId: { organizationId: org.id, userId: req.user.id },
          },
          select: { id: true },
        });
        if (!assignment) {
          return required
            ? next(ApiError.forbidden('Not assigned to this website'))
            : next();
        }
        req.activeOrg = org as ActiveOrg;
        return next();
      }

      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: { organizationId: org.id, userId: req.user.id },
        },
        select: {
          isActive: true,
          role: {
            select: {
              permissions: { select: { permission: { select: { code: true } } } },
            },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return required ? next(ApiError.forbidden('Not a member of this website')) : next();
      }

      req.activeOrg = org as ActiveOrg;
      req.user.permissions = membership.role.permissions.map((p) => p.permission.code);

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
