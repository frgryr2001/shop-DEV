/* eslint-disable space-before-function-paren */
import { StatusCodes } from 'http-status-codes';
import ProductService from '../services/product.service.js';
import { catchAsync } from '@/utils/catchAsync.js';
class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    const { productType } = req.body;
    const newProduct = await ProductService.createProduct(productType, {
      ...req.body,
      productShop: req.user.userId
    });
    return res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message: 'Create product successfully',
      data: newProduct
    });
  });

  getAllDraftForShop = catchAsync(async (req, res, next) => {
    const products = await ProductService.findAllDraftForShop({});
  });
}

export default new ProductController();
