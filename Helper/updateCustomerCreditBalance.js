const Customer = require("../models/customerModel");
const CreditNote = require("../models/creditNoteModel");

const updateCustomerCreditBalance = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return;

    // Extract all credit note IDs
    const creditNoteIds = customer.credits.map((c) => c.creditNoteId);

    // Fetch all credit notes related to the customer
    const creditNotes = await CreditNote.find({
      creditNoteId: { $in: creditNoteIds },
    });

    // Sum up the creditAmount values
    const totalCreditAmount = creditNotes.reduce(
      (sum, note) => sum + (note.creditAmount || 0),
      0
    );

    // Update the customer's creditBalance
    await Customer.findByIdAndUpdate(customerId, {
      creditBalance: totalCreditAmount,
    });
  } catch (error) {
    console.error("Error updating credit balance:", error.message);
  }
};

module.exports = updateCustomerCreditBalance;
