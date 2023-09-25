import { authenticated } from '@/authentication/authUtils';
import productController from '@/controllers/product.controller';
import { productValidation } from '@/validations/product.validation';

import express from 'express';

const router = express.Router();

// check authentication
router.use(authenticated);
router.post(
  '/shop/product',
  productValidation.create,
  productController.createProduct
);

export default router;
