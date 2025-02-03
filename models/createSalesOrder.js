const mongoose = require("mongoose");

const itemDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  },
  {
    strict: false,
  }
);

const createSalesOrder = new mongoose.Schema(
  {
    saleType: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: false,
    },
    sourceDepartment: {
      type: String,
      required: false,
    },
    salesOrderId: {
      type: String,
      required: true,
    },
    salesorderDate: {
      type: String,
      required: true,
    },
    paymentTerms: {
      type: String,
      required: false,
    },
    shipmentDate: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      required: true,
    },
    salesPerson: {
      type: String,
      required: true,
    },
    itemDetails: [itemDetailsSchema],
    subTotal: {
      type: Number,
      default: 0,
    },
    shipmentCharges: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      value: {
        type: String,
        enum: ["Approved", "Rejected", "Draft", "Confirmed", "Closed", "Void"],
        default: "Draft",
      },
      changesAt: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  { timestamps: true }
);

const salesOrder = mongoose.model("salesOrders", createSalesOrder);
module.exports = salesOrder;
