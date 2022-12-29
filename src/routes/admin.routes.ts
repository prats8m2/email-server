import { Router } from 'express';
import updateAdminValidation from '../middlewares/validations/admin/updateAdminValidation';
import AdminController from '../controllers/admin/admin.controller';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import addAdminValidation from '../middlewares/validations/admin/addAdminValidation';
import listAdminValidation from '../middlewares/validations/admin/listAdminValidation';
import viewAdminValidation from '../middlewares/validations/admin/viewAdminValidation';
import deleteAdminValidation from '../middlewares/validations/admin/deleteAdminValidation';
import addSuperAdminValidation from '../middlewares/validations/admin/addSuperAdminValidation';

const router = Router();
const adminController = new AdminController();

router.post('/add', AuthMiddleware, addAdminValidation, adminController.add);
router.post('/superAdmin', adminController.addSuperAdmin);

router.patch(
  '/update',
  AuthMiddleware,
  updateAdminValidation,
  adminController.update
);

router.get('/list', AuthMiddleware, listAdminValidation, adminController.list);

router.get(
  '/view/:id',
  AuthMiddleware,
  viewAdminValidation,
  adminController.view
);

router.delete(
  '/delete/:id',
  AuthMiddleware,
  deleteAdminValidation,
  adminController.delete
);
router.post(
  '/addSuperAdmin',
  AuthMiddleware,
  addSuperAdminValidation,
  adminController.addSuperAdmin
);

export default router;
