import { z } from 'zod';
import { API_KEY_SCOPES } from './service';

export const createKeySchema = z.object({
  name: z.string().min(1).max(120),
  scopes: z.array(z.enum(API_KEY_SCOPES)).min(1).optional(),
});

export type CreateKeyInput = z.infer<typeof createKeySchema>;
