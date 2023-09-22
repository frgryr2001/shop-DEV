/* eslint-disable space-before-function-paren */
import { model, Schema } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import validator from 'validator';
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
      select: false
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false
    },
    roles: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
    // eslint-disable-next-line comma-dangle
  }
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.createKeyPair = async function () {
  const privateKey = await crypto.randomBytes(64).toString('hex');
  const publicKey = await crypto.randomBytes(64).toString('hex');
  return { privateKey, publicKey };
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model(DOCUMENT_NAME, userSchema);

export default User;
