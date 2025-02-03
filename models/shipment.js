const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    salesOrderId: { type: String, required: true },
    packageSlip: { type: String, required: true },
    shipmentOrder: { type: String, required: true },
    shipmentDate: { type: String, required: true },
    carrier: { type: String, required: true },
    shipmentCharges: { type: Number, required: true },
    shipmentStatus: {
      type: String,
      enum: ["Not Shipped", "Shipped", "Delivered", "Not Delivered", "In-Transit", "Out For Delivery", "Failed Delivery Attempt", "Customs Clearance", "Ready For Pickup", "Delayed"],
      default: "Not Shipped",
    },
    notes: { type: String, required: false },
    deliveredDate: { type: String, required: false },
    deliveredTime: { type: String, required: false },
  },
  { timestamps: true }
);

const shipment = mongoose.model("shipment", shipmentSchema);
module.exports = shipment;
