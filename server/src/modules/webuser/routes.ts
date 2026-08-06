import { Router } from 'express';
import multer from 'multer';
import { webUserController } from './controller';
import { authenticate } from '../../middlewares/auth';
import { websiteScope } from '../../middlewares/websiteScope';
import { validate } from '../../middlewares/validate';
import { updateSectionSchema } from './schema';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.use(authenticate(), websiteScope());

router.get('/website', webUserController.getWebsite);
router.put(
  '/website/sections/:sectionId',
  validate(updateSectionSchema),
  webUserController.updateSection,
);
router.post('/media/upload', upload.single('file'), webUserController.uploadMedia);

export default router;
