const { default: mongoose } = require("mongoose");

const newPackage = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    salesOrderId: {
      type: String,
      required: true,
    },
    packageSlip: {
      type: String,
      required: true,
    },
    packageDate: {
      type: String,
      required: true,
    },
    itemDetails: [
      {
        itemName: { type: String, required: true },
        sku: { type: String, required: true },
        ordered: { type: Number, required: true },
        packed: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    carrier: {type: String, required: false},
    shipmentStatus: {type: String, required: false},
    shipmentDate: {type: String, required: false}
  },
  { timeStamps: true }
);

const package = mongoose.model("package", newPackage);
module.exports = package;
