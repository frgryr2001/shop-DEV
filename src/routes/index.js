import express from 'express';
import authRouter from '@/routes/auth';
import { apiKey, permission } from '@/authentication/checkAuth';
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission('0000'));
router.use('/v1', authRouter);

export default router;
