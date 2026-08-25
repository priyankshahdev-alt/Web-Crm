import { Router } from 'express';
import { formController } from './controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate } from '../../middlewares/auth';
import { orgScope } from '../../middlewares/orgScope';
import { rbac } from '../../middlewares/rbac';

const router = Router();

router.use(authenticate(), orgScope());

// Form CRUD
router.get('/', rbac('forms:view'), asyncHandler(formController.list));
router.get('/:id', rbac('forms:view'), asyncHandler(formController.getById));
router.post('/', rbac('forms:create'), asyncHandler(formController.create));
router.patch('/:id', rbac('forms:update'), asyncHandler(formController.update));
router.delete('/:id', rbac('forms:delete'), asyncHandler(formController.remove));

// Public form submission
router.post('/:id/submit', asyncHandler(formController.submitPublic));

// Submissions for a form
router.get('/:id/submissions', rbac('forms:view'), asyncHandler(formController.listSubmissions));
router.patch('/:id/submissions/:submissionId', rbac('forms:update'), asyncHandler(formController.updateSubmissionStatus));
router.delete('/:id/submissions/:submissionId', rbac('forms:delete'), asyncHandler(formController.deleteSubmission));

export default router;
