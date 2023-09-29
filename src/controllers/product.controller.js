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

  updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { productType } = req.body;
    const updatedProduct = await ProductService.updateProduct({
      productId: id,
      productType,
      payload: req.body
    });
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Update product successfully',
      data: updatedProduct
    });
  });

  publishProductByShop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.user;
    const isPublished = await ProductService.publishProductByShop({
      productId: id,
      productShop: userId
    });
    if (!isPublished) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cannot publish product'
      });
    }
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Publish product successfully'
    });
  });

  unPublishProductByShop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.user;
    const isUnPublished = await ProductService.unPublishProductByShop({
      productId: id,
      productShop: userId
    });
    if (!isUnPublished) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cannot unpublish product'
      });
    }
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Unpublish product successfully'
    });
  });

  /**
   * Get all draft product for shop
   * @param {Number} page
   * @param {Number} limit
   * @returns {Promise<Product[]>} products
   *
   */
  getAllDraftForShop = catchAsync(async (req, res, next) => {
    const { page, limit } = req.query;
    const products = await ProductService.findAllDraftForShop({
      productShop: req.user.userId,
      page,
      limit
    });
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Get list product successfully',
      resultCount: products.length,
      data: products
    });
  });

  /**
   * Get all published product for shop
   * @param {Number} page
   * @param {Number} limit
   * @returns {Promise<Product[]>} products
   *
   * */
  getAllPublishedForShop = catchAsync(async (req, res, next) => {
    const { page, limit } = req.query;
    const products = await ProductService.findAllPublishedForShop({
      productShop: req.user.userId,
      page,
      limit
    });
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Get list product successfully',
      resultCount: products.length,
      data: products
    });
  });

  getAllProductsBySearch = catchAsync(async (req, res, next) => {
    const { keySearch } = req.params;
    const products = await ProductService.searchProducts({ keySearch });
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Get list product successfully',
      data: products
    });
  });

  /**
   * Get all products
   *  'page', 'sort', 'limit', 'fields' in queryString
   * @param {
   *    page: Number,
   *    limit: Number,
   *    sort: String,
   *    fields: String
   * } queryString
   * @returns {Promise<Product[]>} products
   */
  getAllProducts = catchAsync(async (req, res, next) => {
    const products = await ProductService.findAllProducts(req.query);
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Get list product successfully',
      resultCount: products.length,
      data: products
    });
  });

  getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await ProductService.findProductById(id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Product not found'
      });
    }
    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: 'Get product successfully',
      data: product
    });
  });
}

export default new ProductController();
