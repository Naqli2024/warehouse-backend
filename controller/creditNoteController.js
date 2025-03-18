const CreditNote = require("../models/creditNoteModel");
const SalesReturn = require("../models/salesReturn");
const Customer = require("../models/customerModel");
const SalesInvoice = require("../models/salesInvoiceModel");
const updateCustomerCreditBalance = require("../Helper/updateCustomerCreditBalance");
const updateInvoiceWithCreditNote = require("../Helper/updateInvoiceWithCreditNote");

const createCreditNote = async (req, res) => {
  try {
    const { salesOrderId } = req.body;

    const invoiceExist = await SalesInvoice.findOne({salesOrderId})
    if(!invoiceExist) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Invoice does not exist for sale order ${salesOrderId}`
      })
    }

    const isExists = await CreditNote.findOne({salesOrderId});
    if (isExists) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Credit notes for Sales order ${salesOrderId} already created`,
      });
    }

    const isReturned = await SalesReturn.findOne({salesOrderId});
    if(!isReturned) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Sales order ${salesOrderId} does not return`
      })
    }

    const newCreditNote = new CreditNote(req.body);
    await newCreditNote.save();

    const customer = await Customer.findOne({"salesList.invoiceId": req.body.invoiceId})
    if (!customer) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Customer with Invoice ID ${invoiceId} not found`,
      });
    }
    // Push new credit note ID to the customer's credits array and save
    customer.credits.push({ creditNoteId: newCreditNote.creditNoteId });
    await customer.save();

     // Recalculate and update creditBalance
     await updateCustomerCreditBalance(customer._id);

     //update invoice with creditNote
     await updateInvoiceWithCreditNote(req.body.invoiceId);

    return res.status(200).json({
      success: true,
      data: newCreditNote,
      message: "New credit note created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const updateCreditNote = async (req, res) => {
    try {
      const { creditNoteId } = req.params; 
      const updateData = req.body; 
  
      // Check if the credit note exists
      const existingCreditNote = await CreditNote.findOne({ creditNoteId });
      if (!existingCreditNote) {
        return res.status(404).json({
          success: false,
          data: null,
          message: `Credit note with ID ${creditNoteId} not found`,
        });
      }
  
      // Update the credit note with new data
      const updatedCreditNote = await CreditNote.findOneAndUpdate(
        { creditNoteId },
        { $set: updateData }, 
        { new: true } 
      );

      // Find the customer and update credit balance
    const customer = await Customer.findOne({ "credits.creditNoteId": creditNoteId });
    if (customer) {
      await updateCustomerCreditBalance(customer._id);
    }
  
      return res.status(200).json({
        success: true,
        data: updatedCreditNote,
        message: "Credit note updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  };

const generateCreditNoteId = async (req, res) => {
  try {
    let creditNote;
    const creditNoteExists = await CreditNote.findOne()
      .sort({ createdAt: -1 })
      .select("creditNoteId");
    if (creditNoteExists && creditNoteExists.creditNoteId) {
      const lastCreditNote = parseInt(
        creditNoteExists.creditNoteId.split("-")[1] || "0",
        10,
        10
      );
      const updatedCreditNote = lastCreditNote + 1;
      creditNote = `CN-${updatedCreditNote.toString().padStart(2, "0")}`;
    } else {
      creditNote = `CN-01`;
    }
    return res.status(200).json({
      success: true,
      data: creditNote,
      message: "Generated new credit note ID",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllCreditNotes = async (req, res) => {
  try {
    const creditNote = await CreditNote.find();
    if (creditNote.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No credit note found",
      });
    }
    return res.status(200).json({
      success: true,
      data: creditNote,
      message: "credit notes data fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteCreditNoteByCreditNoteId = async (req, res) => {
  try {
    const { creditNoteId } = req.params;
    const deletedCreditNote = await CreditNote.findOneAndDelete({
      creditNoteId,
    });
    if (!deletedCreditNote) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Credit note not found",
      });
    }
    // Remove the credit note from the customer's credits array
    const customer = await Customer.findOneAndUpdate(
      { "credits.creditNoteId": creditNoteId },
      { $pull: { credits: { creditNoteId } } },
      { new: true }
    );

    if (customer) {
      await updateCustomerCreditBalance(customer._id);
    }
    return res.status(200).json({
      success: true,
      data: deletedCreditNote,
      message: "Credit note deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getCreditNoteDetailsByCreditNoteId = async(req, res) => {
    try {
        const {creditNoteId} = req.params;
        const creditNoteDetails = await CreditNote.findOne({creditNoteId})
        if(!creditNoteDetails) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Credit note does not exist"
            })
        }
        return res.status(200).json({
            success: true,
            data: creditNoteDetails,
            message: `Credit note ${creditNoteId} details fetched`
        })
    } catch (error) {
        return res.status(500).json({
          success: false,
          data: null,
          message: error.message,
        });
      }
}

const getCreditNoteDetailsByInvoiceId = async(req, res) => {
  try {
      const {invoiceId} = req.params;
      const creditNoteDetails = await CreditNote.findOne({invoiceId})
      if(!creditNoteDetails) {
          return res.status(404).json({
              success: false,
              data: null,
              message: "Credit note does not exist"
          })
      }
      return res.status(200).json({
          success: true,
          data: creditNoteDetails,
          message: `Credit note for ${invoiceId} details fetched`
      })
  } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
}

exports.createCreditNote = createCreditNote;
exports.generateCreditNoteId = generateCreditNoteId;
exports.getAllCreditNotes = getAllCreditNotes;
exports.deleteCreditNoteByCreditNoteId = deleteCreditNoteByCreditNoteId;
exports.updateCreditNote = updateCreditNote;
exports.getCreditNoteDetailsByCreditNoteId = getCreditNoteDetailsByCreditNoteId;
exports.getCreditNoteDetailsByInvoiceId = getCreditNoteDetailsByInvoiceId;