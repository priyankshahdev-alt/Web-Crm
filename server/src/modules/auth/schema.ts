import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().email().max(254),
    password: z.string().min(8).max(128),
  })
  .strict();

export const refreshSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8).max(128),
  })
  .strict();

export const switchOrganizationSchema = z
  .object({
    organizationId: z.string().uuid(),
  })
  .strict();

export const impersonateSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict();

export const impersonateTicketSchema = z
  .object({
    ticket: z.string().min(1),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SwitchOrganizationInput = z.infer<typeof switchOrganizationSchema>;
export type ImpersonateInput = z.infer<typeof impersonateSchema>;
export type ImpersonateTicketInput = z.infer<typeof impersonateTicketSchema>;
