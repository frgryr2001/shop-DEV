/* eslint-disable space-before-function-paren */
import jwt from 'jsonwebtoken';
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
