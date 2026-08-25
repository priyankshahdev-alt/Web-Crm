import { Router } from 'express';
import authRouter from '../modules/auth/routes';
import organizationRouter from '../modules/organization/routes';
import userRouter from '../modules/user/routes';
import roleRouter from '../modules/role/routes';
import auditRouter from '../modules/audit/routes';
import notificationRouter from '../modules/notification/routes';
import mediaRouter from '../modules/media/routes';
import donationRouter from '../modules/donation/routes';
import dashboardRouter from '../modules/dashboard/routes';
import settingsRouter from '../modules/settings/routes';
import pageRouter from '../modules/cms/page/routes';
import sectionTemplateRouter from '../modules/cms/section-template/routes';
import menuRouter from '../modules/cms/menu/routes';
import bannerRouter from '../modules/cms/banner/routes';
import sliderRouter from '../modules/cms/slider/routes';
import siteRouter from '../modules/cms/site/routes';
import websiteRouter from '../modules/cms/website/routes';
import entityRouter from '../modules/entities/index';
import webUserRouter from '../modules/webuser/routes';
import adminRouter from '../modules/admin/routes';
import formRouter from '../modules/forms/routes';
import approvalRouter from '../modules/approval/routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK', data: { status: 'up', timestamp: new Date().toISOString() }, errors: null });
});

router.use('/auth', authRouter);
router.use('/organizations', organizationRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/audit-logs', auditRouter);
router.use('/notifications', notificationRouter);
router.use('/media', mediaRouter);
router.use('/donations', donationRouter);
router.use('/dashboard', dashboardRouter);
router.use('/settings', settingsRouter);
router.use('/pages', pageRouter);
router.use('/sections', sectionTemplateRouter);
router.use('/menus', menuRouter);
router.use('/banners', bannerRouter);
router.use('/sliders', sliderRouter);
router.use('/site', siteRouter);
router.use('/webuser', webUserRouter);
router.use('/admin', adminRouter);
router.use('/websites', websiteRouter);
router.use('/forms', formRouter);
router.use('/approvals', approvalRouter);
router.use('/', entityRouter);

export default router;
