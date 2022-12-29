import { Router } from 'express';
import LoginController from '../controllers/login/login.controller';

const router = Router();
const loginController = new LoginController();

router.get('/status', loginController.connectionStatus);
export default router;
