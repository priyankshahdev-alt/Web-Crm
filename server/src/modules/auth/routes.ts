import { Router } from 'express';
import { authController } from './controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { authLimiter } from '../../middlewares/rateLimiter';
import { changePasswordSchema, loginSchema, refreshSchema, switchOrganizationSchema } from './schema';
import { asyncHandler } from '../../utils/asyncHandler';

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

export default router;
