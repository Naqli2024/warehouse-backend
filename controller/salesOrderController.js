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

exports.createSalesorder = createSalesorder;
exports.getAllSalesOrders = getAllSalesOrders;
