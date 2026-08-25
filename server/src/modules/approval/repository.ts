import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export interface ListParams {
  organizationId: string;
  skip: number;
  take: number;
  status?: string;
  resourceType?: string;
  search?: string;
  from?: Date;
  to?: Date;
}

export interface CreateInput {
  organizationId: string;
  resourceId: string;
  resourceType: string;
  resourceTitle: string;
  action: string;
  submitterNote?: string;
  submitterId?: string;
  contentSnapshot?: Record<string, unknown>;
}

export interface ReviewInput {
  decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  reviewerNote?: string;
  reviewerId: string;
  reviewerName: string;
}

export const approvalRepository = {
  async list(params: ListParams) {
    const where: Prisma.ApprovalRequestWhereInput = {
      organizationId: params.organizationId,
    };

    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }

    if (params.resourceType && params.resourceType !== 'ALL') {
      where.resourceType = params.resourceType;
    }

    if (params.search) {
      where.OR = [
        { resourceTitle: { contains: params.search, mode: 'insensitive' } },
        { resourceType: { contains: params.search, mode: 'insensitive' } },
        { submitter: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { submitter: { lastName: { contains: params.search, mode: 'insensitive' } } },
        { reviewer: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { reviewer: { lastName: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.from || params.to) {
      where.submittedAt = {};
      if (params.from) where.submittedAt.gte = params.from;
      if (params.to) where.submittedAt.lte = params.to;
    }

    const [items, total, pendingCount] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        include: {
          submitter: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
          events: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { submittedAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      prisma.approvalRequest.count({ where }),
      prisma.approvalRequest.count({
        where: { organizationId: params.organizationId, status: 'PENDING' },
      }),
    ]);

    return { items, total, pendingCount };
  },

  async findById(id: string) {
    return prisma.approvalRequest.findUnique({
      where: { id },
      include: {
        submitter: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  async create(input: CreateInput) {
    return prisma.approvalRequest.create({
      data: {
        organizationId: input.organizationId,
        resourceId: input.resourceId,
        resourceType: input.resourceType,
        resourceTitle: input.resourceTitle,
        action: input.action,
        submitterNote: input.submitterNote ?? null,
        submitterId: input.submitterId ?? null,
        contentSnapshot: (input.contentSnapshot as any) ?? Prisma.JsonNull,
        events: {
          create: {
            actorName: 'Submitter',
            actorId: input.submitterId ?? null,
            action: 'SUBMITTED',
            note: input.submitterNote ?? null,
          },
        },
      },
      include: {
        submitter: { select: { id: true, firstName: true, lastName: true, email: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  async addEvent(requestId: string, actorName: string, actorId: string | null, action: string, note?: string) {
    return prisma.approvalEvent.create({
      data: {
        requestId,
        actorName,
        actorId: actorId ?? null,
        action,
        note: note ?? null,
      },
    });
  },

  async review(id: string, input: ReviewInput) {
    return prisma.approvalRequest.update({
      where: { id },
      data: {
        status: input.decision,
        reviewerNote: input.reviewerNote ?? null,
        reviewerId: input.reviewerId,
        reviewedAt: new Date(),
        events: {
          create: {
            actorName: input.reviewerName,
            actorId: input.reviewerId,
            action: input.decision,
            note: input.reviewerNote ?? null,
          },
        },
      },
      include: {
        submitter: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  async countPending(organizationId: string) {
    return prisma.approvalRequest.count({
      where: { organizationId, status: 'PENDING' },
    });
  },
};
