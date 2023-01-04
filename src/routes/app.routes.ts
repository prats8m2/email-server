import { Router } from 'express';
import contactUs from '../controllers/contactUs';

const router = Router();

router.post('/contact-us', contactUs);

export default router;
