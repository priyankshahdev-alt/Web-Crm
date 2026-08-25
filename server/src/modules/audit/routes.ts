import { Router } from 'express';
import { auditController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { orgScope } from '../../middlewares/orgScope';

const router = Router();

router.get('/', authenticate(), orgScope(false), ...auditController.list);

export default router;
