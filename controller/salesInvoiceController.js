const SalesInvoice = require("../models/salesInvoiceModel");
const SalesOrder = require("../models/createSalesOrder");

const createSalesInvoice = async (req, res) => {
  try {
    const { salesOrderId } = req.body;
    const isExists = await SalesOrder.findOne({ salesOrderId });
    if (!isExists || isExists.status.value !== "Approved") {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Sale order does not exist or is not approved",
      });
    }
    // Validate that dueDate is a future date relative to invoiceDate
    const invoiceDateObj = new Date(req.body.invoiceDate);
    const dueDateObj = new Date(req.body.dueDate);

    if (dueDateObj <= invoiceDateObj) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Due date must be a future date after the invoice date",
      });
    }

    const isSalesInvoiceExist = await SalesInvoice.findOne({ salesOrderId });
    if (isSalesInvoiceExist) {
      return res.status(409).json({
        success: false,
        data: null,
        message: `Invoice already created for sales order Id: ${salesOrderId}`,
      });
    }
    const newInvoice = new SalesInvoice(req.body);
    await newInvoice.save();

    res.status(200).json({
      success: true,
      data: newInvoice,
      message: `New Invoice created for sales order ${salesOrderId}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const editSalesInvoice = async (req, res) => {
  try {
    const {
      invoiceId,
      invoiceDate,
      dueDate,
      paymentStatus,
      partialAmount,
      paymentMode,
    } = req.body;

    // Check if Sales Invoice exists
    const existingInvoice = await SalesInvoice.findOne({ invoiceId });
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Sales invoice does not exist",
      });
    }

    // Validate that dueDate is a future date relative to invoiceDate
    if (invoiceDate && dueDate) {
      const invoiceDateObj = new Date(invoiceDate);
      const dueDateObj = new Date(dueDate);

      if (dueDateObj <= invoiceDateObj) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Due date must be a future date after the invoice date",
        });
      }
    }

    // Ensure paymentAmount and paymentMode are provided when selecting HalfPaid
    if (paymentStatus === "HalfPaid") {
      if (!partialAmount || !paymentMode) {
        return res.status(400).json({
          success: false,
          data: null,
          message:
            "Payment amount and payment mode are required for partial payment",
        });
      }
    }

    // Update the Sales Invoice with new data
    const updatedInvoice = await SalesInvoice.findOneAndUpdate(
      { invoiceId },
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedInvoice,
      message: `Sales invoice ${invoiceId} updated successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteSalesInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoiceExists = await SalesInvoice.findOneAndDelete({ invoiceId });
    if (!invoiceExists) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No invoice found",
      });
    }
    return res.status(200).json({
      success: true,
      data: invoiceExists,
      message: "Invoice deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllInvoice = async (req, res) => {
  try {
    const allInvoice = await SalesInvoice.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: allInvoice,
      message: allInvoice ? "All invoices fetched" : "No Invoices available",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const generateInvoiceId = async (req, res) => {
  try {
    // Get today's date in YYYYMMDD format
    const today = new Date();
    const datePart = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    const prefix = `INV-${datePart}-`;

    // Find the latest invoice for today
    const latestInvoice = await SalesInvoice.findOne({
      invoiceId: { $regex: `^${prefix}` },
    })
      .sort({ createdAt: -1 })
      .exec();

    let nextInvoiceNumber = 1;
    if (latestInvoice) {
      const lastInvoiceId = latestInvoice.invoiceId;
      const lastNumber = parseInt(lastInvoiceId.split("-")[2], 10);
      nextInvoiceNumber = lastNumber + 1;
    }

    const invoiceId = `${prefix}${String(nextInvoiceNumber).padStart(2, "0")}`;

    return res.status(200).json({
      success: true,
      data: { invoiceId },
      message: "Generated new invoice ID",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const generateOrderNo = async (req, res) => {
  try {
    const prefix = "order-";

    // Find the last order number in the database
    const lastInvoice = await SalesInvoice.findOne({
      orderNo: { $regex: `^${prefix}` },
    })
      .sort({ createdAt: -1 })
      .lean();

    let nextOrderNumber = 1;

    if (lastInvoice) {
      // Extract the last order number and increment it
      const lastNumber = parseInt(lastInvoice.orderNo.split("-").pop(), 10);
      nextOrderNumber = lastNumber + 1;
    }

    const newOrderNo = `${prefix}${String(nextOrderNumber).padStart(2, "0")}`;

    // Final check to avoid duplicates
    const exists = await SalesInvoice.findOne({ orderNo: newOrderNo });
    if (exists) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "Order number already exists, try again!",
      });
    }

    return res.status(200).json({
      success: true,
      data: { orderNo: newOrderNo },
      message: "Generated new order number",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

exports.createSalesInvoice = createSalesInvoice;
exports.editSalesInvoice = editSalesInvoice;
exports.deleteSalesInvoice = deleteSalesInvoice;
exports.getAllInvoice = getAllInvoice;
exports.generateInvoiceId = generateInvoiceId;
exports.generateOrderNo = generateOrderNo;
