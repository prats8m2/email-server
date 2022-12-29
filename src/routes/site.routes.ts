import { Router } from 'express';
import updateSiteValidation from '../middlewares/validations/site/updateSiteValidation';
import SiteController from '../controllers/site/site.controller';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import addSiteValidation from '../middlewares/validations/site/addSiteValidation';
import listSiteValidation from '../middlewares/validations/site/listSiteValidation';
import viewSiteValidation from '../middlewares/validations/site/viewSiteValidation';
import deleteSiteValidation from '../middlewares/validations/site/deleteSiteValidation';

const router = Router();
const siteController = new SiteController();

router.post('/add', AuthMiddleware, addSiteValidation, siteController.add);

router.patch(
  '/update',
  AuthMiddleware,
  updateSiteValidation,
  siteController.update
);

router.get('/list', AuthMiddleware, listSiteValidation, siteController.list);
router.get('/reports', AuthMiddleware, siteController.reports);

router.get(
  '/view/:id',
  AuthMiddleware,
  viewSiteValidation,
  siteController.view
);

router.delete(
  '/delete/:id',
  AuthMiddleware,
  deleteSiteValidation,
  siteController.delete
);

export default router;
