import { authenticated } from '@/authentication/authUtils';
import authController from '@/controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.post('/shop/signUp', authController.signUp);
router.post('/shop/signIn', authController.signIn);

// check authentication
router.use(authenticated);

// logout
router.post('/shop/logout', authController.logout);
router.post('/shop/refreshToken', authController.handlerRefreshToken);

export default router;
