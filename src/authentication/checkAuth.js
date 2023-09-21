import AppError from '@/utils/AppError';

const { findByKey } = require('@/services/apiKey.service');

/* eslint-disable space-before-function-paren */
const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
};
export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return next(new AppError('Forbidden Error', 403));
    }
    // check key
    const objKey = await findByKey(key);
    if (!objKey) {
      return next(new AppError('Forbidden Error', 403));
    }

    req.apiKey = objKey;

    return next();
  } catch (error) {
    return next(new AppError('Forbidden Error', 403));
  }
};

export const permission = (permission) => {
  return (req, res, next) => {
    const { permissions } = req.apiKey;
    if (permissions.includes(permission)) {
      return next();
    }
    return next(new AppError('Forbidden Error', 403));
  };
};
