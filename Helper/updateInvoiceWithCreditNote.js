const SalesInvoice = require("../models/salesInvoiceModel");
const CreditNote = require("../models/creditNoteModel");
const Customer = require("../models/customerModel");

const updateInvoiceWithCreditNote = async (invoiceId) => {
  try {
    const invoice = await SalesInvoice.findOne({ invoiceId });
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }
    const creditNote = await CreditNote.findOne({ invoiceId });
    if (!creditNote) {
      throw new Error(`CreditNote with Invoice ${invoiceId} not found`);
    }

    // Store a copy of the old invoice before updating
    invoice.invoiceHistory.push(invoice.toObject());

    // Remove returned item from salesInvoice
    //Remove returned item from salesInvoice
    invoice.itemDetails = invoice.itemDetails.filter(
      (item) =>
        !creditNote.itemDetails.some(
          (creditNote) => creditNote.sku === item.sku
        )
    );

    //Recalculate subTotal and update into invoice
    invoice.subTotal = Math.max(0, invoice.subTotal - creditNote.subTotal);

    //Recalculate totalAmount after returned item
    const creditUsed = invoice.creditsUsed || 0;
    invoice.totalAmount = Math.max(
      invoice.totalAmount + creditUsed - creditNote.refundAmount
    );

    // Mark invoice as corrected
    invoice.invoiceCorrected = true;
    invoice.updatedAt = new Date();

    await invoice.save();
    console.log(`Invoice ${invoiceId} updated successfully.`);

    // Find the customer who has this invoice in salesList
    const customer = await Customer.findOne({
      "salesList.invoiceId": invoiceId,
    });
    if (!customer) {
      console.error(
        `Customer with invoiceId ${invoiceId} not found in salesList`
      );
      return;
    }

    // Find existing invoice in salesList and update it
    const salesListIndex = customer.salesList.findIndex(
      (sale) => sale.invoiceId === invoiceId
    );

    if (salesListIndex !== -1) {
      // Update the existing invoice entry
      customer.salesList[salesListIndex] = {
        ...customer.salesList[salesListIndex],
        ...invoice.toObject(),
        invoiceCorrected: true,
        updatedAt: new Date(),
      };
    } else {
      customer.salesList.push({
        ...invoice.toObject(),
        invoiceCorrected: true,
        updatedAt: new Date(),
      });
    }

    await customer.save();
  } catch (error) {
    console.error("Error updating invoice:", error.message);
  }
};

module.exports = updateInvoiceWithCreditNote;
