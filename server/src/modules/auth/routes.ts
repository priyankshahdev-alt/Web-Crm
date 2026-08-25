import { Router } from 'express';
import { authController } from './controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { authLimiter } from '../../middlewares/rateLimiter';
import {
  changePasswordSchema,
  impersonateSchema,
  impersonateTicketSchema,
  loginSchema,
  refreshSchema,
  switchOrganizationSchema,
} from './schema';
import { asyncHandler } from '../../utils/asyncHandler';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(30).optional().nullable(),
  avatarUrl: z.string().url().max(500).optional().nullable(),
}).strict();

const changeEmailSchema = z.object({
  newEmail: z.string().email().max(254),
}).strict();

const revokeAllSessionsSchema = z.object({
  currentFamilyId: z.string().uuid().optional(),
}).strict();

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', authLimiter, validate(refreshSchema), asyncHandler(authController.refresh));
router.post(
  '/switch-organization',
  authenticate(),
  validate(switchOrganizationSchema),
  asyncHandler(authController.switchOrganization),
);
router.post('/logout', authenticate(), asyncHandler(authController.logout));
router.post('/change-password', authenticate(), validate(changePasswordSchema), asyncHandler(authController.changePassword));
router.get('/me', authenticate(), asyncHandler(authController.me));
router.patch('/profile', authenticate(), validate(updateProfileSchema), asyncHandler(authController.updateProfile));
router.post('/email', authenticate(), validate(changeEmailSchema), asyncHandler(authController.changeEmail));
router.get('/sessions', authenticate(), asyncHandler(authController.listSessions));
router.post('/sessions/:id/revoke', authenticate(), asyncHandler(authController.revokeSession));
router.post('/sessions/revoke-all', authenticate(), validate(revokeAllSessionsSchema), asyncHandler(authController.revokeAllOtherSessions));

// Master "log in as admin": the master mints a short-lived ticket, the admin
// panel exchanges it for a real session. The exchange endpoint is deliberately
// unauthenticated — the ticket itself is the credential.
router.post(
  '/impersonate',
  authenticate(),
  validate(impersonateSchema),
  asyncHandler(authController.impersonate),
);
router.post(
  '/impersonate/exchange',
  authLimiter,
  validate(impersonateTicketSchema),
  asyncHandler(authController.exchangeImpersonate),
);

export default router;
