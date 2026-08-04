import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { apiKeyAuth, extractApiKey } from './apiKey';
import { authenticate } from './auth';
import { rbac } from './rbac';

/**
 * Authenticate a request with either an admin JWT (holding `permission`)
 * or an organization API key (holding `scope`).
 */
export function authenticateOrApiKey(permission: string, scope: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (extractApiKey(req)) {
      return apiKeyAuth()(req, res, (err?: unknown) => {
        if (err) return next(err);
        const scopes = (req as Request & { apiKeyScopes?: string[] }).apiKeyScopes ?? [];
        if (!scopes.includes(scope)) {
          return next(ApiError.forbidden(`Missing API key scope: ${scope}`));
        }
        return next();
      });
    }
    return authenticate()(req, res, (err?: unknown) => {
      if (err) return next(err);
      return rbac(permission)(req, res, next);
    });
  };
}
