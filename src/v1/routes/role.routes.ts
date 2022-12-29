import { Router } from 'express';
import updateRoleValidation from '../middlewares/validations/role/updateRoleValidation';
import RoleController from '../controllers/role/role.controller';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import addRoleValidation from '../middlewares/validations/role/addRoleValidation';

const router = Router();
const roleController = new RoleController();

router.post('/add', AuthMiddleware, addRoleValidation, roleController.add);

router.patch(
  '/update',
  AuthMiddleware,
  updateRoleValidation,
  roleController.update
);

router.get('/list/:clientId/:siteId', AuthMiddleware, roleController.list);
router.get('/folders', AuthMiddleware, roleController.folder);

router.delete('/delete/:id', AuthMiddleware, roleController.delete);

router.get('/admin/', AuthMiddleware, roleController.listRoleForAdmin);

export default router;
