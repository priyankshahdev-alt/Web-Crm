import { DomainVerificationStatus, DomainVerificationMethod } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export const verificationRepository = {
  async findDomain(organizationId: string, domain: string) {
    return prisma.externalDomain.findUnique({
      where: { organizationId_domain: { organizationId, domain } },
    });
  },

  async findById(id: string) {
    return prisma.externalDomain.findUnique({ where: { id } });
  },

  async list(organizationId: string) {
    return prisma.externalDomain.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async upsert(organizationId: string, domain: string, token: string, method: string) {
    return prisma.externalDomain.upsert({
      where: { organizationId_domain: { organizationId, domain } },
      update: {
        verificationToken: token,
        method: method as DomainVerificationMethod,
        status: DomainVerificationStatus.PENDING,
        verifiedAt: null,
      },
      create: {
        organizationId,
        domain,
        verificationToken: token,
        method: method as DomainVerificationMethod,
        status: DomainVerificationStatus.PENDING,
      },
    });
  },

  async updateStatus(
    id: string,
    status: DomainVerificationStatus,
    verifiedAt: Date | null,
    checkedAt: Date,
  ) {
    return prisma.externalDomain.update({
      where: { id },
      data: { status, verifiedAt, lastCheckedAt: checkedAt },
    });
  },

  async createApiKey(data: {
    organizationId: string;
    name: string;
    keyPrefix: string;
    keyHash: string;
    scopes: string[];
  }) {
    return prisma.apiKey.create({ data });
  },
};
