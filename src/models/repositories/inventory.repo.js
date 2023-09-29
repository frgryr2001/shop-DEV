import Inventory from '../inventory.model';
import { Types } from 'mongoose';

/* eslint-disable space-before-function-paren */
export const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown'
}) => {
  return await Inventory.create({
    inventoryProductId: productId,
    inventoryShopId: shopId,
    inventoryStock: stock,
    inventoryLocation: location
  });
};
