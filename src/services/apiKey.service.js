/* eslint-disable space-before-function-paren */
import ApiKey from '@/models/apiKey.model';

export const findByKey = async (key) => {
  const objKey = await ApiKey.findOne({ key, status: true }).lean();
  return objKey;
};
