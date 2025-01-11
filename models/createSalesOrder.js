const mongoose = require("mongoose");

const createSalesOrder = new mongoose.Schema({
  saleType: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
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
    required: true,
  },
  shipmentDate: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: String,
    required: true,
  },
  itemDetails: {
    type: Map,
    of: String,
    default: {},
  },
  status: {
    value: {
      type: String,
      enum: ["Delivered", "Open", "Closed", "Pending approval", "Draft"],
      default: "Draft",
    },
    changesAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

const salesOrder = mongoose.model("salesOrders", createSalesOrder);
module.exports = salesOrder;
