import User from '@/models/user.model';
import KeyTokenService from './keyToken.service';
import { createTokenPair, verifyToken } from '@/authentication/authUtils';
import { getInfoData } from '@/utils';
import { RoleShop } from '@/constants/userRole';
import AppError from '@/utils/AppError';
import { findByEmail } from './user.service';
import { StatusCode } from '@/utils/response';

class AuthService {
  static async signIn({ email, password, refreshToken = null }, next) {
    const foundUser = await findByEmail(email);
    if (!foundUser) {
      return next(new AppError('Email or password is incorrect', 400));
    }
    const match = await foundUser.comparePassword(password);
    if (!match) {
      return next(
        new AppError('Email or password is incorrect', StatusCode.UNAUTHORIZED)
      );
    }
    const { privateKey, publicKey } = await foundUser.createKeyPair();
    // created token pair (accessToken, refreshToken)
    const tokens = await createTokenPair(
      { userId: foundUser._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    });

    return {
      statusCode: 200,
      message: 'Sign in successfully',
      data: {
        user: getInfoData({
          fields: ['_id', 'email', 'name', 'roles'],
          object: foundUser.toObject()
        }),
        tokens
      }
    };
  }

  static async signUp({ email, password, name }, next) {
    try {
      const user = new User({
        email,
        password,
        name,
        roles: RoleShop.SHOP
      });
      const newUser = await user.save();

      if (newUser) {
        // created privateKey , publicKey
        const { privateKey, publicKey } = await newUser.createKeyPair();

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey
        });

        if (!keyStore) {
          return next(new AppError('KeyToken not created', 400));
        }

        // created token pair (accessToken, refreshToken)
        const tokens = await createTokenPair(
          { userId: newUser._id, email },
          publicKey,
          privateKey
        );
        return {
          statusCode: 201,
          message: 'Sign up successfully',
          data: {
            user: getInfoData({
              fields: ['_id', 'email', 'name', 'roles'],
              object: newUser.toObject()
            }),
            tokens
          }
        };
      }
      return next(new AppError('Sign up failed', 400));
    } catch (error) {
      return next(error);
    }
  }

  static async logout({ keyStore }, next) {
    await KeyTokenService.deleteKeyById(keyStore._id);
    return {
      statusCode: 200,
      message: 'Logout successfully'
    };
  }

  static async handlerRefreshToken({ refreshToken, user, keyStore }, next) {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      return next(new AppError('Something wrong happen !! Pls re login', 403));
    }
    if (keyStore.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refreshToken', 403));
    }

    const userShop = await findByEmail(email);
    if (!userShop) {
      return next(new AppError('Invalid refreshToken', 403));
    }
    //  cap lai 1 cap token moi cho user
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    // update refreshToken moi vao db
    keyStore.refreshToken = tokens.refreshToken;
    keyStore.refreshTokensUsed.push(refreshToken); // push refreshToken cu vao mang refreshTokensUsed
    await keyStore.save();

    return {
      statusCode: 200,
      message: 'Refresh token successfully',
      data: {
        user,
        tokens
      }
    };
  }
}

export default AuthService;
