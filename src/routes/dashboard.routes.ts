import { Router } from 'express';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import DashboardController from '../controllers/dashboard/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();

router.post('/data', AuthMiddleware, dashboardController.dashboard);
router.post('/audit', AuthMiddleware, dashboardController.auditLogs);
router.post('/exportLogs', AuthMiddleware, dashboardController.exportLogs);

export default router;
