import { authenticatedV2 } from '@/authentication/authUtils';
import authController from '@/controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);

// check authentication
router.use(authenticatedV2);

// logout
router.post('/logout', authController.logout);
router.post('/refreshToken', authController.handlerRefreshToken);

export default router;
