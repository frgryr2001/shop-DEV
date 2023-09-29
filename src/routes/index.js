import express from 'express';
import authRouter from '@/routes/auth';
import productRouter from '@/routes/product';
import { apiKey, permission } from '@/authentication/checkAuth';
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission('0000'));

router.use('/v1/shop/auth', authRouter);
router.use('/v1/shop/product', productRouter);

export default router;
