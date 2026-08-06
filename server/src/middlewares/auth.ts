import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken, type AccessTokenPayload } from '../utils/jwt';
import type { AuthUser } from '../types';

export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
  return null;
}

/**
 * Authenticate a request using the signed access token only.
 *
 * The roles and permissions are read straight from the JWT (they are signed
 * at login/refresh time) instead of re-querying the database on every request,
 * which removes one round trip to the DB per API call.
 */
export function authenticate(required = true): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractBearerToken(req.headers.authorization);
      if (!token) {
        if (required) return next(ApiError.unauthorized('Missing access token'));
        return next();
      }

      let payload: AccessTokenPayload;
      try {
        payload = verifyAccessToken(token);
      } catch {
        return next(ApiError.unauthorized('Invalid or expired access token'));
      }

      const authUser: AuthUser = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName ?? null,
        isMaster: payload.isMaster,
        roles: payload.roles,
        permissions: payload.permissions,
        websiteId: payload.websiteId ?? null,
      };

      req.user = authUser;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
