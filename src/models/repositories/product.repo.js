/* eslint-disable space-before-function-paren */
import ApiFeatures from '@/utils/apiFeatures';
import { Product } from '../product.model';
import { Types } from 'mongoose';
export const queryProducts = async ({ query, queryString }) => {
  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 50;
  const skip = (page - 1) * limit;
  return await Product.find(query)
    .populate('productShop', 'name email -_id')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
export const findAllDraftForShop = async ({ query, queryString }) => {
  return await queryProducts({ query, queryString });
};

export const findAllPublishedForShop = async ({ query, queryString }) => {
  return await queryProducts({ query, queryString });
};

export const publishProductByShop = async ({ productId, productShop }) => {
  const foundShop = await Product.findOneAndUpdate(
    {
      _id: new Types.ObjectId(productId),
      productShop: new Types.ObjectId(productShop)
    },
    {
      isDraft: false,
      isPublished: true
    }
  );
  return !!foundShop;
};

export const unPublishProductByShop = async ({ productId, productShop }) => {
  const foundShop = await Product.findOneAndUpdate(
    {
      _id: new Types.ObjectId(productId),
      productShop: new Types.ObjectId(productShop)
    },
    {
      isDraft: true,
      isPublished: false
    }
  );
  return !!foundShop;
};

export const searchProducts = async ({ keySearch }) => {
  const searchRegex = new RegExp(keySearch, 'i');
  return await Product.find(
    {
      isPublished: true,
      $text: { $search: searchRegex }
    },
    {
      score: { $meta: 'textScore' }
    }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
};

export const findAllProducts = async (queryString) => {
  const feature = new ApiFeatures(
    Product.find({
      isPublished: true
    }),
    queryString
  );
  feature.filter().sort().fields().paginate();
  return await feature.exec();
};

export const findProductById = async (productId) => {
  const feature = new ApiFeatures(
    Product.find({
      isPublished: true
    }),
    {
      _id: productId,
      fields: '-__v'
    }
  )
    .filter()
    .fields();
  return await feature.exec();
};

export const updateProductId = async ({
  productId,
  updateData,
  model,
  isNew = true
}) => {
  return await model.findByIdAndUpdate(productId, updateData, {
    new: isNew
  });
};
