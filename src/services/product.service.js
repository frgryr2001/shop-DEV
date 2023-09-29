/* eslint-disable indent */
// using Factory Pattern to create a service
import {
  Product as ProductModel,
  Electronic as ElectronicModel,
  Clothing as ClothingModel,
  Furniture as FurnitureModel
} from '@/models/product.model';
import { insertInventory } from '@/models/repositories/inventory.repo';
import {
  findAllDraftForShop,
  findAllProducts,
  findAllPublishedForShop,
  findProductById,
  publishProductByShop,
  searchProducts,
  unPublishProductByShop,
  updateProductId
} from '@/models/repositories/product.repo';
import { updateNestedObjectParser } from '@/utils';
import AppError from '@/utils/AppError';

class ProductFactory {
  static productRegister = {};

  static registerProduct(productType, productClass) {
    this.productRegister[productType] = productClass;
  }

  static async createProduct(productType, payload) {
    const ProductClass = this.productRegister[productType];
    if (!ProductClass) {
      throw new AppError('Cannot create product', 400);
    }
    return new ProductClass(payload).createProduct();
  }

  static async updateProduct({ productId, productType, payload }) {
    const ProductClass = this.productRegister[productType];
    if (!ProductClass) {
      throw new AppError('Cannot create product', 400);
    }
    return new ProductClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ productId, productShop }) {
    return await publishProductByShop({ productId, productShop });
  }

  static async unPublishProductByShop({ productId, productShop }) {
    return await unPublishProductByShop({ productId, productShop });
  }

  //   query
  static async findAllDraftForShop({ productShop, page, limit }) {
    const query = { productShop, isDraft: true };
    return await findAllDraftForShop({ query, queryString: { page, limit } });
  }

  static async findAllPublishedForShop({ productShop, page, limit }) {
    const query = { productShop, isPublished: true };
    return await findAllPublishedForShop({
      query,
      queryString: { page, limit }
    });
  }

  static async searchProducts({ keySearch }) {
    return await searchProducts({ keySearch });
  }

  static async findAllProducts(queryString) {
    return await findAllProducts(queryString);
  }

  static async findProductById(productId) {
    return await findProductById(productId);
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
    const product = await ProductModel.create({ ...this, _id: productId });
    if (!product) {
      throw new AppError('Cannot create product', 400);
    }
    await insertInventory({
      productId,
      shopId: this.productShop,
      stock: this.productQuantity
    });
    return product;
  }

  async updateProduct(productId, updateData) {
    return await updateProductId({
      productId,
      updateData,
      model: ProductModel
    });
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

  async updateProduct(productId) {
    const objParams = this;

    if (objParams.productAttributes) {
      // update child
      await updateProductId({
        productId,
        updateData: updateNestedObjectParser(objParams.productAttributes),
        model: ClothingModel
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objParams)
    );
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.productAttributes,
      productShop: this.productShop
    });
    if (!newFurniture) {
      throw new AppError('Cannot create furniture', 400);
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new AppError('Cannot create product', 400);
    }
    return newProduct;
  }
}

ProductFactory.registerProduct('clothing', Clothing);
ProductFactory.registerProduct('electronic', Electronic);
ProductFactory.registerProduct('furniture', Furniture);

export default ProductFactory;
