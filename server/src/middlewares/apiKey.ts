import { createHash } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { prisma } from '../libs/prisma';
import { ApiError } from '../utils/ApiError';

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

export function extractApiKey(req: Request): string | null {
  const header = req.headers.authorization;
  if (header) {
    const parts = header.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer' && parts[1].startsWith('wcrm_')) {
      return parts[1];
    }
  }
  const xKey = req.headers['x-api-key'];
  if (typeof xKey === 'string' && xKey.startsWith('wcrm_')) return xKey;
  return null;
}

/**
 * Authenticate a request with an organization API key.
 * Resolves the owning organization and sets req.activeOrg + req.apiKeyId.
 */
export function apiKeyAuth(required = true): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const key = extractApiKey(req);
      if (!key) {
        if (required) return next(ApiError.unauthorized('Missing API key'));
        return next();
      }

      const record = await prisma.apiKey.findUnique({
        where: { keyHash: hashApiKey(key) },
        select: {
          id: true,
          isActive: true,
          expiresAt: true,
          revokedAt: true,
          scopes: true,
          organization: { select: { id: true, slug: true, name: true, status: true } },
        },
      });

      if (!record || !record.isActive || record.revokedAt) {
        return next(ApiError.unauthorized('Invalid API key'));
      }
      if (record.expiresAt && record.expiresAt < new Date()) {
        return next(ApiError.unauthorized('API key expired'));
      }
      if (record.organization.status !== 'ACTIVE') {
        return next(ApiError.forbidden('Organization is not active'));
      }

      await prisma.apiKey.update({
        where: { id: record.id },
        data: { lastUsedAt: new Date() },
      });

      (req as Request & { apiKeyId?: string; apiKeyScopes?: string[] }).apiKeyId = record.id;
      (req as Request & { apiKeyScopes?: string[] }).apiKeyScopes = record.scopes;
      (req as Request & { activeOrg?: unknown }).activeOrg = {
        id: record.organization.id,
        slug: record.organization.slug,
        name: record.organization.name,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

/** Assert the active API key holds a given scope. */
export function requireScope(scope: string): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const scopes = (req as Request & { apiKeyScopes?: string[] }).apiKeyScopes ?? [];
    if (!scopes.includes(scope)) {
      return next(ApiError.forbidden(`Missing API key scope: ${scope}`));
    }
    return next();
  };
}
