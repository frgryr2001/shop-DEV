import KeyToken from '@/models/keytoken.model';

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await KeyToken.create({
        user: userId,
        publicKey: publicKeyString,
        privateKey
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }
}

export default KeyTokenService;
