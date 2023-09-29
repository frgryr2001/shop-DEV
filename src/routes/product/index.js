import { authenticatedV2 } from '@/authentication/authUtils';
import productController from '@/controllers/product.controller';
import { productValidation } from '@/validations/product.validation';

import express from 'express';

const router = express.Router();

router.get('/search/:keySearch', productController.getAllProductsBySearch);
router.get('/getAllProducts', productController.getAllProducts);
router.get('/:id', productController.getProductById);
// check authentication
router.use(authenticatedV2);
router.post('', productValidation.create, productController.createProduct);
router.patch('/:id', productValidation.update, productController.updateProduct);
router.patch('/publish/:id', productController.publishProductByShop);
router.patch('/unpublish/:id', productController.unPublishProductByShop);
router.get('/drafts/all', productController.getAllDraftForShop);
router.get('/published/all', productController.getAllPublishedForShop);

export default router;
