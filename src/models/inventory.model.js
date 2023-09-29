/* eslint-disable space-before-function-paren */
import { model, Schema } from 'mongoose';
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    inventoryProductId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    inventoryLocation: {
      type: String,
      required: true,
      default: 'unknown'
    },
    inventoryStock: {
      type: Number,
      required: true
    },
    inventoryShopId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    inventoryReservations: {
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

const Inventory = model(DOCUMENT_NAME, inventorySchema);

export default Inventory;
