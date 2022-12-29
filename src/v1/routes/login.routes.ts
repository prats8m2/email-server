import { Router } from 'express';
import LoginController from '../controllers/login/login.controller';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import authValidation from '../middlewares/validations/login/authValidation';
import forgotPassValidation from '../middlewares/validations/login/forgotPassValidation';
import resetPassValidation from '../middlewares/validations/login/resetPassValidation';

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
