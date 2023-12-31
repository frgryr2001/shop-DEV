/* eslint-disable space-before-function-paren */
import AppError from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import joi from 'joi';

const create = catchAsync(async (req, res, next) => {
  const schema = joi.object({
    productName: joi.string().required(),
    productThumbnail: joi.string().required(),
    productPrice: joi.number().required(),
    productQuantity: joi.number().required(),
    productDescription: joi.string().required(),
    productType: joi.string().required(),
    productAttributes: joi.when('productType', {
      is: 'electronic',
      then: joi.object({
        manufacturer: joi.string().required(),
        model: joi.string().required(),
        color: joi.string().required()
      }),
      otherwise: joi.object({
        brand: joi.string().required(),
        size: joi.string().required(),
        material: joi.string().required()
      })
    })
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, StatusCodes.BAD_REQUEST));
  }
  next();
});

const update = catchAsync(async (req, res, next) => {
  const schema = joi.object({
    productName: joi.string(),
    productThumbnail: joi.string(),
    productPrice: joi.number(),
    productQuantity: joi.number(),
    productDescription: joi.string(),
    productType: joi.string().required().messages({
      'string.required': 'Product type is required',
      'string.base': 'Product type must have type of string',
      'any.only': 'Product type must be either electronic or clothing'
    }),
    productAttributes: joi.when('productType', {
      is: 'electronic',
      then: joi.object({
        manufacturer: joi.string(),
        model: joi.string(),
        color: joi.string()
      }),
      otherwise: joi.object({
        brand: joi.string(),
        size: joi.string(),
        material: joi.string()
      })
    })
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, StatusCodes.BAD_REQUEST));
  }
  next();
});

export const productValidation = {
  create,
  update
};
