import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post(`/login`, authController.login);
router.post(`/register`, authController.register);
router.post(`/refreshToken`, authController.refreshToken);
router.get(`/getUserId`, authController.getUserId);

export const authRouter = router;
