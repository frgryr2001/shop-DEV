import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'KeyToken';
const COLLECTION_NAME = 'KeyTokens';

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    refreshTokensUsed: {
      type: Array,
      default: [] // store refresh token used
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const KeyToken = model(DOCUMENT_NAME, keyTokenSchema, COLLECTION_NAME);

export default KeyToken;
