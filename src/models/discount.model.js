import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discountName: {
      type: String,
      required: true
    },
    discountDescription: {
      type: String,
      required: true
    },
    discountType: {
      type: String,
      required: true,
      enum: ['percent', 'fixed'],
      default: 'fixed'
    },
    discountValue: {
      type: Number,
      required: true
    },
    discountCode: {
      type: String,
      required: true
    },
    discountStartDate: {
      type: Date,
      required: true
    },
    discountEndDate: {
      type: Date,
      required: true
    },
    discountMaxUses: {
      type: Number,
      required: true
    },
    discountUsesCount: {
      // Số lần sử dụng
      type: Number,
      required: true
    },
    discountUsersUsed: {
      // Danh sách user đã sử dụng
      type: Array,
      default: []
    },
    discountMaxUsesPerUser: {
      // Số lần sử dụng tối đa cho mỗi user
      type: Number,
      required: true
    },
    discountMinOrderValue: {
      type: Number,
      required: true
    },
    discountShopId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    discountIsActive: {
      type: Boolean,
      required: true
    },
    discountAppliedTo: {
      type: String,
      required: true,
      enum: ['all', 'specific']
    },
    discountProductIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Product'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const discount = model(DOCUMENT_NAME, discountSchema, COLLECTION_NAME);

export default discount;
