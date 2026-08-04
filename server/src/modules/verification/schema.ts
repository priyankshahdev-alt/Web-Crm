import { z } from 'zod';

export const claimDomainSchema = z
  .object({
    domain: z.string().min(3).max(253),
    method: z.enum(['META_TAG', 'FILE', 'DNS_TXT']).optional(),
  })
  .strict();

export const checkDomainSchema = z
  .object({
    method: z.enum(['META_TAG', 'FILE', 'DNS_TXT']).optional(),
  })
  .strict();

export type ClaimDomainInput = z.infer<typeof claimDomainSchema>;
export type CheckDomainInput = z.infer<typeof checkDomainSchema>;
