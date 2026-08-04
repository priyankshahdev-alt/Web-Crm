import { Router } from 'express';
import { apiKeyController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { rbac } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { createKeySchema } from './schema';

const router = Router({ mergeParams: true });

router.use(authenticate(), rbac('organization:settings'));

router.get('/', asyncHandler(apiKeyController.list));
router.post('/', validate(createKeySchema), asyncHandler(apiKeyController.create));
router.delete('/:keyId', asyncHandler(apiKeyController.revoke));

export default router;
