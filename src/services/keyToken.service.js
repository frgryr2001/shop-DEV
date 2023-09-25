import KeyToken from '@/models/keytoken.model';

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken
      };

      const options = { upsert: true, new: true };
      const tokens = await KeyToken.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static async findByUserId(userId) {
    const keyToken = await KeyToken.findOne({
      user: userId
    });

    return keyToken;
  }

  static async deleteKeyById(id) {
    return await KeyToken.findByIdAndDelete(id);
  }

  static async findByRefreshTokenUsed(refreshToken) {
    return await KeyToken.findOne({ refreshTokensUsed: refreshToken }).lean();
  }

  static async deleteKeyByUserId(userId) {
    return await KeyToken.findOneAndDelete({ user: userId });
  }

  static async findByRefreshToken(refreshToken) {
    return await KeyToken.findOne({ refreshToken });
  }
}

export default KeyTokenService;
