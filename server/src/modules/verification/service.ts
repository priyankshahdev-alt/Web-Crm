import { randomBytes } from 'node:crypto';
import { resolveTxt } from 'node:dns/promises';
import type { Request } from 'express';
import { DomainVerificationStatus, DomainVerificationMethod } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/audit';
import { assertCanManageOrg } from '../organization/service';
import { hashApiKey } from '../../middlewares/apiKey';
import { safeFetch, validateDomain } from './ssrf';
import { verificationRepository } from './repository';
import type { CheckDomainInput, ClaimDomainInput } from './schema';

function generateToken(): string {
  return randomBytes(24).toString('base64url');
}

function generateApiKey(): { key: string; keyPrefix: string; keyHash: string } {
  const key = `wcrm_${randomBytes(24).toString('base64url')}`;
  return { key, keyPrefix: key.slice(0, 12), keyHash: hashApiKey(key) };
}

function instructions(domain: string, token: string, method: DomainVerificationMethod) {
  const host = `https://${domain}`;
  switch (method) {
    case DomainVerificationMethod.META_TAG:
      return [
        `Open your homepage source (${host}/).`,
        `Paste this tag inside the <head> section, then publish:`,
        '',
        `<meta name="webcrm-verify" content="${token}" />`,
      ];
    case DomainVerificationMethod.FILE:
      return [
        `Create a file at ${host}/.well-known/webcrm-verify.txt`,
        `with EXACTLY this content (no extra spaces/newlines):`,
        '',
        token,
      ];
    case DomainVerificationMethod.DNS_TXT:
      return [
        `Add a TXT record in your DNS provider:`,
        '',
        `  Name:  _webcrm-verify.${domain}`,
        `  Value: ${token}`,
        '',
        `DNS can take a few minutes to propagate.`,
      ];
  }
}

async function checkMetaTag(domain: string, token: string): Promise<boolean> {
  const { body } = await safeFetch(`https://${domain}/`);
  const pattern = new RegExp(
    `<meta[^>]+name=["']webcrm-verify["'][^>]*content=["']${token}["']`,
    'i',
  );
  return pattern.test(body);
}

async function checkFile(domain: string, token: string): Promise<boolean> {
  const { body } = await safeFetch(`https://${domain}/.well-known/webcrm-verify.txt`);
  return body.trim() === token;
}

async function checkDnsTxt(domain: string, token: string): Promise<boolean> {
  let records: string[][];
  try {
    records = await resolveTxt(`_webcrm-verify.${domain}`);
  } catch {
    return false;
  }
  return records.flat().some((value) => value.trim() === token);
}

export const verificationService = {
  async claim(organizationId: string, input: ClaimDomainInput, req: Request) {
    await assertCanManageOrg(req, organizationId);
    const domain = validateDomain(input.domain);
    const method = (input.method as DomainVerificationMethod) ?? DomainVerificationMethod.META_TAG;
    const token = generateToken();

    const record = await verificationRepository.upsert(organizationId, domain, token, method);

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'CREATE',
      resource: 'externalDomain',
      resourceId: record.id,
      message: `Domain claimed for verification: ${domain}`,
      req,
    });

    return {
      id: record.id,
      domain,
      method,
      status: record.status,
      token,
      instructions: instructions(domain, token, method),
    };
  },

  async check(organizationId: string, domainId: string, input: CheckDomainInput, req: Request) {
    await assertCanManageOrg(req, organizationId);
    const record = await verificationRepository.findById(domainId);
    if (!record || record.organizationId !== organizationId) {
      throw ApiError.notFound('Domain not found');
    }
    if (record.status === DomainVerificationStatus.VERIFIED) {
      throw ApiError.conflict('Domain is already verified. Re-claim it to rotate the token.');
    }

    const method = (input.method as DomainVerificationMethod | undefined) ?? record.method;
    let ok = false;
    try {
      if (method === DomainVerificationMethod.META_TAG) {
        ok = await checkMetaTag(record.domain, record.verificationToken);
      } else if (method === DomainVerificationMethod.FILE) {
        ok = await checkFile(record.domain, record.verificationToken);
      } else {
        ok = await checkDnsTxt(record.domain, record.verificationToken);
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Verification check failed';
      await verificationRepository.updateStatus(
        record.id,
        DomainVerificationStatus.FAILED,
        null,
        new Date(),
      );
      throw ApiError.badRequest(`Verification failed: ${message}`);
    }

    if (!ok) {
      await verificationRepository.updateStatus(
        record.id,
        DomainVerificationStatus.FAILED,
        null,
        new Date(),
      );
      throw ApiError.badRequest('Verification failed. The token was not found on your site — check the instructions and try again.');
    }

    const verifiedAt = new Date();
    await verificationRepository.updateStatus(
      record.id,
      DomainVerificationStatus.VERIFIED,
      verifiedAt,
      verifiedAt,
    );

    const { key, keyPrefix, keyHash } = generateApiKey();
    const apiKey = await verificationRepository.createApiKey({
      organizationId,
      name: `External site — ${record.domain}`,
      keyPrefix,
      keyHash,
      scopes: ['site:read'],
    });

    await recordAudit({
      userId: req.user?.id,
      organizationId,
      action: 'UPDATE',
      resource: 'externalDomain',
      resourceId: record.id,
      message: `Domain verified: ${record.domain} (${method})`,
      req,
    });

    return {
      id: record.id,
      domain: record.domain,
      method,
      status: DomainVerificationStatus.VERIFIED,
      verifiedAt: verifiedAt.toISOString(),
      apiKey: {
        id: apiKey.id,
        key,
        keyPrefix,
        name: apiKey.name,
        scopes: apiKey.scopes,
        note: 'This key is shown only once. Store it safely.',
      },
    };
  },

  async list(organizationId: string, req: Request) {
    await assertCanManageOrg(req, organizationId);
    const rows = await verificationRepository.list(organizationId);
    return rows.map((row) => ({
      id: row.id,
      domain: row.domain,
      method: row.method,
      status: row.status,
      token: row.verificationToken,
      verifiedAt: row.verifiedAt,
      lastCheckedAt: row.lastCheckedAt,
      createdAt: row.createdAt,
    }));
  },
};
