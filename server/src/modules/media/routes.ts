import { Router } from 'express';
import multer from 'multer';
import { mediaController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { orgScope } from '../../middlewares/orgScope';
import { rbac } from '../../middlewares/rbac';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.use(authenticate(), orgScope());

router.get('/', rbac('media:view'), ...mediaController.list);
router.post(
  '/upload',
  rbac('media:create'),
  upload.single('file'),
  mediaController.upload,
);
router.patch('/:id/rename', rbac('media:update'), mediaController.rename);
router.patch('/:id/move', rbac('media:update'), mediaController.moveToFolder);
router.delete('/:id', rbac('media:delete'), mediaController.remove);

export default router;
