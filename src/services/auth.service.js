import User from '@/models/user.model';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '@/authentication/authUtils';
import { getInfoData } from '@/utils';
import { RoleShop } from '@/constants/userRole';
import AppError from '@/utils/AppError';

class AuthService {
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
          code: 201,
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
}

export default AuthService;
