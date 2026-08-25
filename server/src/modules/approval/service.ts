import { prisma } from '../../libs/prisma';
import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/audit';
import { notificationService } from '../notification/service';
import type { Request } from 'express';
import {
  approvalRepository,
  type CreateInput,
  type ReviewInput,
  type ListParams,
} from './repository';

interface PublishContext {
  resourceType: string;
  resourceId: string;
  organizationId: string;
}

async function publishResource(ctx: PublishContext) {
  switch (ctx.resourceType) {
    case 'page': {
      await prisma.page.update({
        where: { id: ctx.resourceId },
        data: { status: 'PUBLISHED' },
      });
      break;
    }
    case 'blog': {
      await prisma.blog.update({
        where: { id: ctx.resourceId },
        data: { status: 'PUBLISHED', publishedAt: new Date() },
      });
      break;
    }
    case 'event': {
      await prisma.event.update({
        where: { id: ctx.resourceId },
        data: { status: 'PUBLISHED' },
      });
      break;
    }
    case 'project': {
      await prisma.project.update({
        where: { id: ctx.resourceId },
        data: { status: 'PUBLISHED' },
      });
      break;
    }
    case 'gallery': {
      await prisma.gallery.update({
        where: { id: ctx.resourceId },
        data: { status: 'PUBLISHED' },
      });
      break;
    }
    default:
      throw new Error(`Unsupported resource type: ${ctx.resourceType}`);
  }
}

async function notifyUser(
  userId: string,
  organizationId: string,
  title: string,
  body: string,
  link: string,
) {
  try {
    await notificationService.create({
      userId,
      organizationId,
      title,
      body,
      type: 'info',
      link,
    });
  } catch {
    /* notification failure is non-fatal */
  }
}

export const approvalService = {
  async list(params: ListParams) {
    return approvalRepository.list(params);
  },

  async getById(id: string) {
    const item = await approvalRepository.findById(id);
    if (!item) throw ApiError.notFound('Approval request not found');
    return item;
  },

  async create(input: CreateInput, req?: Request) {
    const existing = await prisma.approvalRequest.findFirst({
      where: {
        organizationId: input.organizationId,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        action: input.action,
        status: 'PENDING',
      },
    });
    if (existing) {
      throw ApiError.badRequest('A pending approval request already exists for this content.');
    }

    const item = await approvalRepository.create(input);

    await recordAudit({
      userId: input.submitterId,
      organizationId: input.organizationId,
      action: 'SUBMIT',
      resource: 'approval',
      resourceId: item.id,
      message: `Submitted ${input.resourceType} "${input.resourceTitle}" for review`,
      after: { resourceType: input.resourceType, resourceId: input.resourceId, action: input.action } as any,
      req,
    });

    const orgUsers = await prisma.organizationUser.findMany({
      where: { organizationId: input.organizationId, isActive: true },
      select: { userId: true },
    });

    for (const ou of orgUsers) {
      if (ou.userId !== input.submitterId) {
        await notifyUser(
          ou.userId,
          input.organizationId,
          `New ${input.resourceType} submitted for review`,
          `"${input.resourceTitle}" needs your review.`,
          '/approvals',
        );
      }
    }

    return item;
  },

  async review(id: string, input: ReviewInput, req?: Request) {
    const existing = await approvalRepository.findById(id);
    if (!existing) throw ApiError.notFound('Approval request not found');
    if (existing.status !== 'PENDING') {
      throw ApiError.badRequest('This request has already been reviewed');
    }

    if (input.decision === 'APPROVED') {
      await publishResource({
        resourceType: existing.resourceType,
        resourceId: existing.resourceId,
        organizationId: existing.organizationId,
      });
    }

    const item = await approvalRepository.review(id, input);

    const actionMessages: Record<string, string> = {
      APPROVED: 'Approved & published',
      REJECTED: 'Rejected',
      CHANGES_REQUESTED: 'Changes requested',
    };

    await recordAudit({
      userId: input.reviewerId,
      organizationId: existing.organizationId,
      action: input.decision,
      resource: 'approval',
      resourceId: id,
      message: `${actionMessages[input.decision]} ${existing.resourceType} "${existing.resourceTitle}"`,
      before: { status: existing.status },
      after: { status: input.decision, reviewerNote: input.reviewerNote },
      req,
    });

    if (existing.submitterId && existing.submitterId !== input.reviewerId) {
      await notifyUser(
        existing.submitterId,
        existing.organizationId,
        `${existing.resourceType} ${actionMessages[input.decision]?.toLowerCase() || input.decision.toLowerCase()}`,
        `"${existing.resourceTitle}" — ${input.reviewerNote || 'No comment provided.'}`,
        '/approvals',
      );
    }

    return item;
  },

  async countPending(organizationId: string) {
    return approvalRepository.countPending(organizationId);
  },
};
