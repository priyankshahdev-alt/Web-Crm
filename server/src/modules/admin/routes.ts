import { Router } from 'express';
import multer from 'multer';
import { adminController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { requireAdmin } from '../../middlewares/requireAdmin';
import { validate } from '../../middlewares/validate';
import { updateSectionSchema } from '../webuser/schema';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

// Platform-admin only. Unlike the web-user routes, there is no websiteScope:
// an admin is not bound to one website and can target any websiteId.
router.use(authenticate(), requireAdmin());

router.get('/websites', adminController.listWebsites);
router.get('/websites/:websiteId', adminController.getWebsite);
router.put(
  '/websites/:websiteId/sections/:sectionId',
  validate(updateSectionSchema),
  adminController.updateSection,
);
router.post('/media/upload', upload.single('file'), adminController.uploadMedia);

export default router;