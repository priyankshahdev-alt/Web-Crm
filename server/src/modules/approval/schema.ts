import { z } from 'zod';

export const createApprovalSchema = z
  .object({
    resourceType: z.string().min(1).max(100),
    resourceId: z.string().min(1).max(200),
    resourceTitle: z.string().min(1).max(500),
    action: z.string().min(1).max(100),
    submitterNote: z.string().max(2000).optional(),
    contentSnapshot: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const reviewApprovalSchema = z
  .object({
    decision: z.enum(['APPROVED', 'REJECTED', 'CHANGES_REQUESTED']),
    reviewerNote: z.string().max(2000).optional(),
  })
  .strict();

export const listApprovalSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  resourceType: z.string().optional(),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  tab: z.enum(['PENDING', 'ALL']).optional(),
});
