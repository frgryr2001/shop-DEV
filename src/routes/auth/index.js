import authController from '@/controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.post('/shop/signup', authController.signUp);

export default router;
