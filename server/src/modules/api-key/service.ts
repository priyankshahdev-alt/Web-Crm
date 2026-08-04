import { randomBytes } from 'node:crypto';
import type { Request } from 'express';
import { prisma } from '../../libs/prisma';
import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/audit';
import { hashApiKey } from '../../middlewares/apiKey';
import { assertCanManageOrg } from '../organization/service';

export const API_KEY_SCOPES = ['site:read', 'site:import'] as const;

export type ApiKeyScope = (typeof API_KEY_SCOPES)[number];

function generateApiKey(): { key: string; keyPrefix: string; keyHash: string } {
  const key = `wcrm_${randomBytes(24).toString('base64url')}`;
  return { key, keyPrefix: key.slice(0, 12), keyHash: hashApiKey(key) };
}

/** Generate, persist and return a new API key. The raw key is shown only once. */
export async function issueApiKey(data: {
  organizationId: string;
  name: string;
  scopes: ApiKeyScope[];
}): Promise<{
  id: string;
  name: string;
  keyPrefix: string;
  scopes: ApiKeyScope[];
  key: string;
  createdAt: Date;
}> {
  const { key, keyPrefix, keyHash } = generateApiKey();
  const record = await prisma.apiKey.create({
    data: {
      organizationId: data.organizationId,
      name: data.name,
      keyPrefix,
      keyHash,
      scopes: data.scopes,
    },
  });
  return {
    id: record.id,
    name: record.name,
    keyPrefix,
    scopes: record.scopes as ApiKeyScope[],
    key,
    createdAt: record.createdAt,
  };
}

export const apiKeyService = {
  async list(organizationId: string, req: Request) {
    await assertCanManageOrg(req, organizationId);
    const rows = await prisma.apiKey.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      keyPrefix: row.keyPrefix,
      scopes: row.scopes,
      isActive: row.isActive,
      lastUsedAt: row.lastUsedAt,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
      createdAt: row.createdAt,
    }));
  },

  async create(
    organizationId: string,
    input: { name: string; scopes?: ApiKeyScope[] },
    req: Request,
  ) {
    await assertCanManageOrg(req, organizationId);
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    if (!org) throw ApiError.notFound('Organization not found');

    const scopes = (input.scopes ?? ['site:read']).filter((s) =>
      (API_KEY_SCOPES as readonly string[]).includes(s),
    ) as ApiKeyScope[];

    const result = await issueApiKey({ organizationId, name: input.name, scopes });

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'CREATE',
      resource: 'apiKey',
      resourceId: result.id,
      message: `API key created: ${result.name}`,
      req,
    });

    return {
      id: result.id,
      name: result.name,
      keyPrefix: result.keyPrefix,
      scopes: result.scopes,
      key: result.key,
      note: 'This key is shown only once. Store it safely.',
      createdAt: result.createdAt,
    };
  },

  async revoke(organizationId: string, keyId: string, req: Request) {
    await assertCanManageOrg(req, organizationId);
    const record = await prisma.apiKey.findFirst({
      where: { id: keyId, organizationId },
    });
    if (!record) throw ApiError.notFound('API key not found');

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false, revokedAt: new Date() },
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'DELETE',
      resource: 'apiKey',
      resourceId: keyId,
      message: `API key revoked: ${record.name}`,
      req,
    });

    return true;
  },
};
