import { Router } from 'express';
import { organizationController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { rbac } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  assignAdminSchema,
  createOrganizationSchema,
  createSiteUserSchema,
  updateOrganizationSchema,
  updateSettingsSchema,
} from './schema';
import verificationRouter from '../verification/routes';
import importRouter from '../import/routes';
import apiKeyRouter from '../api-key/routes';

const router = Router();

router.get(
  '/',
  authenticate(),
  rbac('organization:view'),
  ...organizationController.list,
);
router.get('/:id', authenticate(), rbac('organization:view'), asyncHandler(organizationController.getById));
router.post(
  '/',
  authenticate(),
  rbac('organization:create'),
  validate(createOrganizationSchema),
  asyncHandler(organizationController.create),
);
router.patch(
  '/:id',
  authenticate(),
  rbac('organization:update'),
  validate(updateOrganizationSchema),
  asyncHandler(organizationController.update),
);
router.delete(
  '/:id',
  authenticate(),
  rbac('organization:delete'),
  asyncHandler(organizationController.remove),
);
router.get('/:id/settings', authenticate(), rbac('organization:settings'), asyncHandler(organizationController.getSettings));
router.put(
  '/:id/settings',
  authenticate(),
  rbac('organization:settings'),
  validate(updateSettingsSchema),
  asyncHandler(organizationController.updateSettings),
);

router.use('/:id/verify', verificationRouter);
router.use('/:id/import', importRouter);
router.use('/:id/api-keys', apiKeyRouter);

router.get('/:id/users', authenticate(), rbac('user:view'), ...organizationController.listUsers);
router.post(
  '/:id/users',
  authenticate(),
  rbac('user:create'),
  validate(createSiteUserSchema),
  asyncHandler(organizationController.createUser),
);
router.delete(
  '/:id/users/:userId',
  authenticate(),
  rbac('user:delete'),
  asyncHandler(organizationController.removeUser),
);

router.get('/:id/admins', authenticate(), rbac('organization:assign'), asyncHandler(organizationController.listAdmins));
router.post(
  '/:id/admins',
  authenticate(),
  rbac('organization:assign'),
  validate(assignAdminSchema),
  asyncHandler(organizationController.assignAdmin),
);
router.delete(
  '/:id/admins/:userId',
  authenticate(),
  rbac('organization:assign'),
  asyncHandler(organizationController.removeAdmin),
);

export default router;
