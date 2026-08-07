import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Gate a route behind platform-admin access.
 *
 * Unlike `orgScope`/`websiteScope`, an admin is NOT scoped to a single
 * website: they can query or edit any organization. The check is performed on
 * the signed JWT claims only (isMaster or the `admins` platform role), never
 * on client-supplied website ids.
 */
export function requireAdmin(): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (req.user.isMaster || req.user.roles.includes('admins')) {
      return next();
    }
    return next(ApiError.forbidden('Admin access required'));
  };
}
