import { Router } from 'express';
import multer from 'multer';
import { websiteController } from './controller';
import { authenticate } from '../../../middlewares/auth';
import { websiteScope } from './scope';
import { rbac } from '../../../middlewares/rbac';
import { validate } from '../../../middlewares/validate';
import { asyncHandler } from '../../../utils/asyncHandler';
import { patchSectionSchema, publishWebsiteSchema, putSectionSchema, reorderSectionsSchema, draftSectionSchema } from './schema';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

// Authenticated, scoped to the website resolved from the :slug path segment.
router.use('/:slug', authenticate(), websiteScope());

router.get('/:slug/live-images', rbac('site:view'), asyncHandler(websiteController.getLiveImages));

router.get('/:slug', rbac('site:view'), asyncHandler(websiteController.get));
router.get('/:slug/content', rbac('site:view'), asyncHandler(websiteController.content));

router.post(
  '/:slug/publish',
  rbac('page:update'),
  validate(publishWebsiteSchema),
  asyncHandler(websiteController.publish),
);

router.post(
  '/:slug/preview-link',
  rbac('site:view'),
  asyncHandler(websiteController.previewLink),
);

router.get(
  '/:slug/pages/:pageSlug',
  rbac('page:view'),
  asyncHandler(websiteController.getPage),
);
router.get(
  '/:slug/pages/:pageSlug/sections/:sectionType',
  rbac('section:view'),
  asyncHandler(websiteController.getSection),
);
router.put(
  '/:slug/pages/:pageSlug/sections/reorder',
  rbac('section:update'),
  validate(reorderSectionsSchema),
  asyncHandler(websiteController.reorderSections),
);
router.put(
  '/:slug/pages/:pageSlug/publish',
  rbac('page:update'),
  asyncHandler(websiteController.publishPage),
);
router.delete(
  '/:slug/pages/:pageSlug/draft',
  rbac('section:update'),
  asyncHandler(websiteController.discardPageDrafts),
);
router.put(
  '/:slug/pages/:pageSlug/sections/:sectionType/draft',
  rbac('section:update'),
  validate(draftSectionSchema),
  asyncHandler(websiteController.saveSectionDraft),
);
router.put(
  '/:slug/pages/:pageSlug/sections/:sectionType',
  rbac('section:update'),
  validate(putSectionSchema),
  asyncHandler(websiteController.putSection),
);
router.patch(
  '/:slug/pages/:pageSlug/sections/:sectionType',
  rbac('section:update'),
  validate(patchSectionSchema),
  asyncHandler(websiteController.patchSection),
);
router.delete(
  '/:slug/pages/:pageSlug/sections/:sectionType',
  rbac('section:delete'),
  asyncHandler(websiteController.removeSection),
);

router.post(
  '/:slug/upload',
  rbac('media:create'),
  upload.single('file'),
  asyncHandler(websiteController.upload),
);
router.delete(
  '/:slug/media/:mediaId',
  rbac('media:delete'),
  asyncHandler(websiteController.removeMedia),
);

export default router;
