const mongoose = require("mongoose");

const creditNoteSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    salesOrderId: { type: String, required: true },
    companyName: { type: String, required: true },
    creditNoteId: { type: String, required: true },
    creditNoteDate: { type: String, required: true },
    salesPerson: { type: String, required: true },
    itemDetails: [
      {
        itemName: { type: String, required: true },
        sku: { type: String, required: true },
        reason: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        gst: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    ],
    notes: { type: String, required: false },
    subTotal: { type: Number, required: true },
    shippingCharges: { type: Number, required: false },
    VAT: { type: Number, required: false },
    totalAmount: { type: Number, required: false },
    priceAdjustment: { type: Number, required: false },
    refundAmount: { type: Number, required: false },
    status: {
      type: String,
      enum: ["Approved", "Reject", "Draft", "Closed", "On-Hold"],
      required: false,
      default: "Draft",
    },
    refundStatus: {
      type: String,
      enum: ["Direct refund", "Future credit", "Link to invoice", "On-Hold"],
      required: false,
    },
    refund: {
      refundDate: { type: String, required: false },
      paymentMode: { type: String, required: false },
      amount: { type: Number, required: false },
    },
    creditAmount: {type: Number, required: false},
    invoiceId: {type: String, required: false},
  },
  { timestamps: true }
);

const creditNote = mongoose.model("creditNote", creditNoteSchema);
module.exports = creditNote;
