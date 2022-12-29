import { Router } from 'express';
import authValidation from '../middlewares/validations/login/authValidation';
import LoginController from '../controllers/login/login.controller';
import forgotPassValidation from '../middlewares/validations/login/forgotPassValidation';
import resetPassValidation from '../middlewares/validations/login/resetPassValidation';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';

const router = Router();
const loginController = new LoginController();

router.post('/auth', authValidation, loginController.auth);
router.post(
  '/forgot-password',
  forgotPassValidation,
  loginController.forgotPassword
);
router.post(
  '/reset-password',
  resetPassValidation,
  loginController.resetPassword
);

router.get('/creds', AuthMiddleware, loginController.creds);

export default router;
