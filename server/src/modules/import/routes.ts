import { Router, json } from 'express';
import { importController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { rbac } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { importSchema } from './schema';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate(),
  rbac('organization:import'),
  json({ limit: '25mb' }),
  validate(importSchema),
  asyncHandler(importController.run),
);

export default router;
