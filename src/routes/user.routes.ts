import { Router } from 'express';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import UserController from '../controllers/user/user.controller';
import changePassValidation from '../middlewares/validations/user/changePassValidation';
import updateUserValidation from '../middlewares/validations/user/updateUserValidation';
import addUserValidation from '../middlewares/validations/user/addUserValidation';
import listUserValidation from '../middlewares/validations/user/listUserValidation';
import viewUserValidation from '../middlewares/validations/user/viewUserValidation';
import deleteUserValidation from '../middlewares/validations/user/deleteUserValidation';
import addUserValidationWithoutSnowflake from '../middlewares/validations/user/addUserValidationWithoutSnowflake';

const router = Router();
const userController = new UserController();

router.post('/add', AuthMiddleware, addUserValidation, userController.add);
router.post(
  '/addUser',
  AuthMiddleware,
  addUserValidationWithoutSnowflake,
  userController.addUser
);

router.patch(
  '/update',
  AuthMiddleware,
  updateUserValidation,
  userController.update
);

router.get('/list', AuthMiddleware, listUserValidation, userController.list);

router.get(
  '/view/:id',
  AuthMiddleware,
  viewUserValidation,
  userController.view
);

router.get('/profile/', AuthMiddleware, userController.getProfile);
router.patch('/profile/', AuthMiddleware, userController.updateProfile);

router.get(
  '/assignedFolders/',
  AuthMiddleware,
  userController.getAssignedFolder
);
router.delete(
  '/delete/:id',
  AuthMiddleware,
  deleteUserValidation,
  userController.delete
);

router.post(
  '/change-password',
  AuthMiddleware,
  changePassValidation,
  userController.changePassword
);
export default router;
