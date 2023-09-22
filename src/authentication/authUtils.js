/* eslint-disable space-before-function-paren */
import KeyTokenService from '@/services/keyToken.service';
import AppError from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { StatusCode } from '@/utils/response';
import jwt from 'jsonwebtoken';

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
};
export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '2 days'
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify', err);
      } else {
        console.log('decode verify', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

export const authenticated = catchAsync(async (req, res, next) => {
  // 1 - Check userId in token
  // 2 - get accessToken from header
  // 3 - check accessToken
  // 4 - check user in db
  // 5- check keyStore with this userId
  // 6 - oke
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    return next(new AppError('Invalid Request ', StatusCode.UNAUTHORIZED));
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    return next(new AppError('Not found keyStore ', StatusCode.NOT_FOUND));
  }

  if (req.headers.authorization?.startsWith('Bearer')) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) {
      return next(
        new AppError('UNAUTHORIZED , invalid request', StatusCode.UNAUTHORIZED)
      );
    }

    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      return next(
        new AppError('UNAUTHORIZED , invalid userId', StatusCode.UNAUTHORIZED)
      );
    }
    req.keyStore = keyStore;
    return next();
  }
});

export const verifyToken = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};
