import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Gate routes behind the website-user scope resolved from the JWT claim.
 *
 * The websiteId comes from the signed token (set at login/refresh), never
 * from client input, so a user can only ever reach their own site.
 */
export function websiteScope(required = true): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!req.user.websiteId) {
      if (required) {
        return next(ApiError.forbidden('No website access: not scoped to a single website'));
      }
      return next();
    }
    return next();
  };
}
