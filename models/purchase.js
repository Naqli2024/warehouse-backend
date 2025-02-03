const mongoose = require("mongoose");

const createPurchaseSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    partNumber: {
      type: String,
      required: true,
    },
    hnsCode: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    MRP: {
      type: String,
      required: true,
    },
    purchaseRate: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: String,
      required: true,
    },
    GST: {
      type: String,
      required: true,
    },
    advanceAmount: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    wareHouse: {
      type: String,
      required: true,
    },
    rack: {
      type: String,
      required: true,
    },
    shelf: {
      type: String,
      required: true,
    },
    shelfSpace: {
      type: String,
      required: true,
    },
    operationType: {
      type: String,
      required: true,
    },
    storageCondition: {
      type: String,
      required: true,
    },
    storageCost: {
      type: String,
      required: true,
    },
    storageDate: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: String,
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    invoiceValue: {
      type: String,
      required: true,
    },
    extraFields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

const purchase = mongoose.model("purchase", createPurchaseSchema);

module.exports = purchase;
