const salesOrder = require("../models/createSalesOrder");
const deliveryChallan = require("../models/createChallan");

const createDeliveryChallan = async (req, res) => {
  try {
    const challanForSalesOrderExists = await deliveryChallan.findOne({
      salesOrderId: req.body.salesOrderId,
    });
    if (challanForSalesOrderExists) {
      return res.status(409).json({
        success: false,
        data: null,
        message: `Already challan created for saleOrderId: ${req.body.salesOrderId}`,
      });
    }

    const salesOrderExists = await salesOrder.findOne({
      salesOrderId: req.body.salesOrderId,
    });
    if (!salesOrderExists) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "No sale order found",
      });
    }

    const newChallan = new deliveryChallan(req.body);
    await newChallan.save();

    return res.status(200).json({
      success: true,
      data: newChallan,
      message: "New challan created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllChallans = async (req, res) => {
  try {
    const challans = await deliveryChallan.find();
    if (!challans) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No challans found",
      });
    }
    return res.status(200).json({
      success: true,
      data: challans,
      message: "All delivery challans fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getChallanBySalesOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const challan = await deliveryChallan.findOne({ salesOrderId: id });
    if (!challan) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Challan not found for SalesOrderId: ${id}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: challan,
      message: "Challan fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const generateDeliveryChallan = async (req, res) => {
  try {
    let deliveryChallanGenerated;
    const newChallan = await deliveryChallan
      .findOne()
      .sort({ createdAt: -1 })
      .select("deliveryChallan");
    if (newChallan) {
      const latestChallan = parseInt(newChallan.deliveryChallan.split("-")[1]);
      const newChallanNumber = latestChallan + 1;

      deliveryChallanGenerated = `DC-${newChallanNumber
        .toString()
        .padStart(4, "0")}`;
    } else {
      deliveryChallanGenerated = "DC-0000";
    }
    return res.status(200).json({
      success: true,
      data: deliveryChallanGenerated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteChallanBySalesOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedChallan = await deliveryChallan.findOneAndDelete({
      salesOrderId: id,
    });
    if (!deletedChallan) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Delivery challan for Sale order ${id} not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `Delivery challan for sale order ${id} has been deleted`,
      data: deletedChallan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

exports.createDeliveryChallan = createDeliveryChallan;
exports.getAllChallans = getAllChallans;
exports.getChallanBySalesOrderId = getChallanBySalesOrderId;
exports.generateDeliveryChallan = generateDeliveryChallan;
exports.deleteChallanBySalesOrderId = deleteChallanBySalesOrderId;
