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

const createChallanSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  salesOrderId: { type: String, required: true },
  deliveryChallan: { type: String, required: true },
  deliveryChallanDate: { type: String, required: true },
  expectedDeliveryDate: { type: String, required: true },
  challanType: {
    type: String,
    required: true,
    enum: ["Supply of Liquid Gas", "Job Work", "Supply on Approval", "Others"],
  },
  itemDetails: [itemDetailsSchema],
});

const createChallan = mongoose.model("createChallan", createChallanSchema);
module.exports = createChallan;
