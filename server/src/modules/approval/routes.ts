import { Router } from 'express';
import { approvalController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { orgScope } from '../../middlewares/orgScope';

const router = Router();

router.get('/', authenticate(), orgScope(), ...approvalController.list);
router.get('/pending-count', authenticate(), orgScope(), approvalController.pendingCount);
router.get('/:id', authenticate(), orgScope(), approvalController.getById);
router.post('/', authenticate(), orgScope(), approvalController.create);
router.post('/:id/review', authenticate(), orgScope(), approvalController.review);

export default router;
