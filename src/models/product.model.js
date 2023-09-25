import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true
    },
    productSlug: {
      type: String
    },
    productThumbnail: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },
    productDescription: {
      type: String
    },
    productQuantity: {
      type: Number,
      required: true
    },
    productType: {
      type: String,
      required: true,
      enum: ['electronic', 'clothing', 'furniture']
    },
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }, // <=> shop id
    productAttributes: {
      type: Schema.Types.Mixed,
      required: true
    },
    productRatingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must can not be more than 5.0'],
      set: (val) => Math.round(val * 10) / 10 // 4.666666, 46.66666, 47, 4.7
    },
    productVariations: {
      type: Array,
      required: true,
      default: []
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);
// eslint-disable-next-line space-before-function-paren
productSchema.pre('save', async function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

// define the product type = clothes

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true
    },
    size: String,
    material: String,
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'clothes'
  }
);

// define the product type = electronics

const electronicSchema = new Schema(
  {
    brand: {
      type: String,
      required: true
    },
    size: String,
    material: String,
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'electronics'
  }
);

const furnitureSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true
    },
    model: String,
    color: String,
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'furniture'
  }
);

const Product = model(DOCUMENT_NAME, productSchema, COLLECTION_NAME);
const Clothing = model('Clothing', clothingSchema, 'clothes');
const Electronic = model('Electronic', electronicSchema, 'electronics');
const Furniture = model('Furniture', furnitureSchema, 'furniture');
export { Product, Clothing, Electronic, Furniture };
