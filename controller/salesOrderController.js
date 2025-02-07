const salesOrder = require("../models/createSalesOrder");

const createSalesorder = async (req, res) => {
  try {
    const newOrder = new salesOrder({ ...req.body });
    await newOrder.save();

    return res.status(200).json({
      success: true,
      message: "New sales order created",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getAllSalesOrders = async (req, res) => {
  try {
    const salesOrders = await salesOrder.find();
    return res.status(200).json({
      success: true,
      message: "Sales orders fetched",
      data: salesOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getSaleOrderBySalesOrderId = async (req, res) => {
  const { saleOrderId } = req.params;
  try {
    const saleOrderData = await salesOrder.findOne({
      salesOrderId: String(saleOrderId),
    });
    if (!saleOrderData) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Sale order not found",
      });
    }
    return res.status(200).json({
      message: "Sale order fetched successfully",
      data: saleOrderData,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const updateStatusOfSalesOrder = async (req, res) => {
  const { salesOrderId, status } = req.body;

  try {
    const updatedSaleOrderData = await salesOrder.findOneAndUpdate(
      { salesOrderId: salesOrderId },
      { $set: { "status.value": status } },
      { new: true }
    );
    if (!updatedSaleOrderData) {
      return res.status(404).json({
        success: false,
        message: "Sale order not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedSaleOrderData,
      message: "Sale order status updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteSaleOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSaleOrder = await salesOrder.findByIdAndDelete({ _id: id });
    if (!deletedSaleOrder) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No saleorder found",
      });
    }
    return res.status(200).json({
      success: true,
      data: deletedSaleOrder,
      message: "Saleorder deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getSaleOrderConfirmed = async (req, res) => {
  try {
    const confirmedSaleOrder = await salesOrder.find({
      "status.value": "Confirmed",
    });
    if (!confirmedSaleOrder) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No order confirmed",
      });
    }
    return res.status(200).json({
      message: "Sales details fetched",
      data: confirmedSaleOrder,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const generateSalesOrderId = async (req, res) => {
  try {
    let saleOrderId;

    const lastSaleOrder = await salesOrder
      .findOne()
      .sort({ createdAt: -1 })
      .select("salesOrderId");
    if (lastSaleOrder && lastSaleOrder.salesOrderId) {
      const lastSaleOrderNumber = parseInt(lastSaleOrder.salesOrderId.split("-")[1], 10);
      const newSaleOrder = lastSaleOrderNumber + 1;
      saleOrderId = `SO-${newSaleOrder.toString().padStart(2, "0")}`;
    } else {
      saleOrderId = "SO-00";
    }
    return res.status(200).json({
      success: true,
      data: saleOrderId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

exports.createSalesorder = createSalesorder;
exports.getAllSalesOrders = getAllSalesOrders;
exports.getSaleOrderBySalesOrderId = getSaleOrderBySalesOrderId;
exports.updateStatusOfSalesOrder = updateStatusOfSalesOrder;
exports.deleteSaleOrderById = deleteSaleOrderById;
exports.getSaleOrderConfirmed = getSaleOrderConfirmed;
exports.generateSalesOrderId = generateSalesOrderId;