/* eslint-disable indent */
// using Factory Pattern to create a service
import {
  Product as ProductModel,
  Electronic as ElectronicModel,
  Clothing as ClothingModel
} from '@/models/product.model';
import AppError from '@/utils/AppError';

class ProductFactory {
  static async createProduct(productType, payload) {
    switch (productType) {
      case 'electronic':
        return new Electronic(payload).createProduct();
      case 'clothing':
        return new Clothing(payload).createProduct();
      default:
        throw new AppError('Cannot create product', 400);
    }
  }
}

class Product {
  constructor({
    productName,
    productThumbnail,
    productPrice,
    productDescription,
    productQuantity,
    productType,
    productShop,
    productAttributes
  }) {
    this.productName = productName;
    this.productThumbnail = productThumbnail;
    this.productPrice = productPrice;
    this.productDescription = productDescription;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAttributes = productAttributes;
  }

  async createProduct(productId) {
    return await ProductModel.create({ ...this, _id: productId });
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.productAttributes,
      productShop: this.productShop
    });
    if (!newElectronic) {
      throw new AppError('Cannot create electronic', 400);
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new AppError('Cannot create product', 400);
    }
    return newProduct;
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.productAttributes,
      productShop: this.productShop
    });
    if (!newClothing) {
      throw new AppError('Cannot create clothing', 400);
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new AppError('Cannot create product', 400);
    }
    return newProduct;
  }
}

export default ProductFactory;
