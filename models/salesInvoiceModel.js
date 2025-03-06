const mongoose = require("mongoose");

const salesInvoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    salesOrderId: { type: String, required: true },
    invoiceId: { type: String, required: true },
    invoiceDate: { type: String, required: true },
    paymentTerms: { type: String, required: true },
    dueDate: { type: String, required: true },
    orderNo: { type: String, required: true },
    itemDetails: [
      {
        itemName: { type: String, default: "" },
        sku: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        gst: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    ],
    subTotal: { type: Number, required: true },
    shippingCharges: { type: Number, required: false },
    VAT: { type: Number, required: false },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Draft"],
      required: false,
      default: "Draft",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "HalfPaid", "Paid", "Approved"],
        required: false,
        default: "Pending"
    },
    partialAmount: {type: Number, required: false},
    paymentMode: {type: String, required: false},
    invoiceCorrected: {type: Boolean, default: false},
    creditsUsed: {type: Number},
     // Store old versions of invoices
     invoiceHistory: [
      {
        type: Object, // Stores full invoice copy before modification
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const salesInvoice = mongoose.model("salesInvoice", salesInvoiceSchema);
module.exports = salesInvoice;
