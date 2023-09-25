import { Product } from '../product.model';

// eslint-disable-next-line space-before-function-paren
export const findAllDraftForShop = async ({ query, queryString }) => {
  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 50;
  const skip = (page - 1) * limit;
  return await Product.find(query)
    .populate('productShop', 'name email -_id')
    .sort(-1)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
