const mongoose = require("mongoose");
const purchase = require("./purchase");

const createInventorySchema = new mongoose.Schema(
  {
    salesInformation: {
      salePrice: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
    inventoryTracking: {
      openingInventory: {
        type: String,
        required: true,
      },
      restockPoint: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);
createInventorySchema.add(purchase.schema);

const inventory = mongoose.model("inventory", createInventorySchema);
module.exports = inventory;
