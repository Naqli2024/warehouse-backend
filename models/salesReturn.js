const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    salesOrderId: { type: String, required: true },
    companyName: { type: String, required: true },
    salesReturnId: { type: String, required: true },
    salesReturnDate: { type: String, required: true },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: String, required: true },
    warehouse: { type: String, required: true },
    itemDetails: [
      {
        itemName: { type: String, required: true },
        sku: { type: String, required: true },
        unitPrice: {type: Number, required: true},
        reason: { type: String, required: true },
        shipped: { type: Number, required: true },
        returned: { type: Number, required: true, default: 0 },
        returnQty: { type: Number, required: false, default: 0 },
        receivableQty: { type: Number, required: false, default: 0 },
        creditQty: { type: Number, required: false },
      },
    ],
    status: {
      type: String,
      enum: ["Approved", "Closed"],
      required: false,
      default: "Approved",
    },
  },
  { timestamps: true }
);

const salesReturn = mongoose.model("salesReturn", salesReturnSchema);
module.exports = salesReturn;
