const mongoose = require("mongoose");

const wareHouseScehma = new mongoose.Schema({
  warehouseName: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, required: true, enum: ["Active", "Inactive", "Under Maintenance", "Closed"] },
  warehouseManager: { type: String, required: true },
  spaceConfiguration: {
    finishedProduct: {
      width: { type: Number, required: false },
      height: { type: Number, required: false },
      spaces: [{
        spaceName: { type: String, required: false },
        width: { type: Number, required: false },
        height: { type: Number, required: false },
        noOfRacks: { type: Number, required: false },
        noOfStacks: { type: Number, required: false },
        noOfLevels: { type: Number, required: false },
        boxPerPallet: { type: Number, required: false },
        palletPerUnit: { type: Number, required: false }
      }]
    },
    spareParts: {
      width: { type: Number, required: false },
      height: { type: Number, required: false },
      spaces: [{
        spaceName: { type: String, required: false },
        width: { type: Number, required: false },
        height: { type: Number, required: false },
        noOfRacks: { type: Number, required: false },
        noOfStacks: { type: Number, required: false },
        noOfLevels: { type: Number, required: false },
        boxPerPallet: { type: Number, required: false },
        palletPerUnit: { type: Number, required: false }
      }]
    },
    rawMaterials: {
      width: { type: Number, required: false },
      height: { type: Number, required: false },
      spaces: [{
        spaceName: { type: String, required: false },
        width: { type: Number, required: false },
        height: { type: Number, required: false },
        noOfRacks: { type: Number, required: false },
        noOfStacks: { type: Number, required: false },
        noOfLevels: { type: Number, required: false },
        boxPerPallet: { type: Number, required: false },
        palletPerUnit: { type: Number, required: false }
      }]
    },
  },
  sizeCustomization: {
    totalWarehouseSize: {
      width: { type: Number, required: false },
      height: { type: Number, required: false },
    },
  },
}, {timestamps: true});

const warehouse = new mongoose.model("warehouse", wareHouseScehma);
module.exports = warehouse;
