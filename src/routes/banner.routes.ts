import { Router } from 'express';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import BannerController from '../controllers/banner/banner.controller';

const router = Router();
const bannerController = new BannerController();

router.post('/add', AuthMiddleware, bannerController.addBanner);
router.get('/get/:client', AuthMiddleware, bannerController.getBanner);

export default router;
