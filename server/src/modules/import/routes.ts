import { Router, json } from 'express';
import { importController } from './controller';
import { authenticateOrApiKey } from '../../middlewares/authOrApiKey';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { importSchema } from './schema';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticateOrApiKey('organization:import', 'site:import'),
  json({ limit: '25mb' }),
  validate(importSchema),
  asyncHandler(importController.run),
);

export default router;
