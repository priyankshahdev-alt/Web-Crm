import { Router } from 'express';
import { verificationController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { rbac } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { verificationLimiter } from '../../middlewares/rateLimiter';
import { checkDomainSchema, claimDomainSchema } from './schema';

const router = Router({ mergeParams: true });

router.use(authenticate(), rbac('organization:settings'));

router.get('/', asyncHandler(verificationController.list));
router.post('/', validate(claimDomainSchema), asyncHandler(verificationController.claim));
router.post(
  '/:domainId/check',
  verificationLimiter,
  validate(checkDomainSchema),
  asyncHandler(verificationController.check),
);

export default router;
