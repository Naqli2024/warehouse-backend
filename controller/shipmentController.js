const Shipment = require("../models/shipment");
const Package = require("../models/createPackage");
const Saleorder = require("../models/createSalesOrder");

const createShipment = async (req, res) => {
  try {
    const saleOrder = await Saleorder.findOne({
      customerName: req.body.customerName,
      salesOrderId: req.body.salesOrderId
    })

    if(!saleOrder) {
      return res.status(404).json({
        success: false,
        message: `No matching sales order found for Customer: ${req.body.customerName} and Sales Order ID: ${req.body.salesOrderId}`,
        data: null,
      })
    }

    const shipmentExists = await Shipment.findOne({
      salesOrderId: req.body.salesOrderId,
    });

    if (shipmentExists) {
      return res.status(500).json({
        success: false,
        message: `Sales order ${req.body.salesOrderId} already shipped as ${shipmentExists.shipmentOrder}`,
        data: null,
      });
    }

    const findPackage = await Package.findOne({
      salesOrderId: req.body.salesOrderId,
    });
    if (findPackage) {
      Object.assign(findPackage, {
        carrier: req.body.carrier,
        shipmentStatus: req.body.shipmentStatus,
        shipmentDate: req.body.shipmentDate,
      });
      await findPackage.save();
    }

    const newShipment = new Shipment(req.body);
    await newShipment.save();

    return res.status(200).json({
      success: true,
      message: "New shipment created",
      data: newShipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const generateShipmentOrder = async (req, res) => {
  try {
    let shipmentOrder;

    // Find the last created shipment order
    const lastShipment = await Shipment.findOne()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select("shipmentOrder"); // Select only the shipmentOrder field

    if (lastShipment && lastShipment.shipmentOrder) {
      // Extract the numeric part from the last shipmentOrder
      const lastOrderNumber = parseInt(
        lastShipment.shipmentOrder.split("-")[1],
        10
      );
      const newOrderNumber = lastOrderNumber + 1;

      // Generate the new shipment order with leading zeros
      shipmentOrder = `Order-${newOrderNumber.toString().padStart(4, "0")}`;
    } else {
      // If no previous shipmentOrder exists, start with "Order-0001"
      shipmentOrder = "Order-0001";
    }

    return res.status(200).json({
      success: true,
      data: shipmentOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getShipmentDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const shipmentDetails = await Shipment.findOne({ salesOrderId: id });
    if (!shipmentDetails) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `No Shipment Details found for salesOrderId ${id}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: shipmentDetails,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteShipmentByShipmentOrder = async (req, res) => {
  const { shipmentOrder } = req.params;
  try {
    const deletedShipment = await Shipment.findOneAndDelete({ shipmentOrder });
    if (!deletedShipment) {
      return res.status(404).json({
        success: false,
        message: `No shipment order found for this Id ${shipmentOrder}`,
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: `Shipment order with Id ${shipmentOrder} has been deleted`,
      data: deletedShipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updateShipmentStatus = async (req, res) => {
  const {
    salesOrderId,
    shipmentOrder,
    shipmentStatus,
    deliveredDate,
    deliveredTime,
  } = req.body;

  try {
    const updatedShipment = await Shipment.findOne({
      $or: [{ salesOrderId: salesOrderId }, { shipmentOrder: shipmentOrder }],
    });
    if (!updatedShipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
        data: null,
      });
    }
    updatedShipment.shipmentStatus = shipmentStatus;
    updatedShipment.deliveredDate = deliveredDate;
    updatedShipment.deliveredTime = deliveredTime;
    await updatedShipment.save();
    return res.status(200).json({
      success: true,
      message: `Shipment status for ${
        shipmentOrder
          ? `shipmentOrder: ${shipmentOrder}`
          : `salesOrderId: ${salesOrderId}`
      } has been updated`,
      data: updatedShipment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    if (!shipments) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No shipment found",
      });
    }
    return res.status(200).json({
      message: "Shipment data fetched",
      data: shipments,
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

exports.createShipment = createShipment;
exports.generateShipmentOrder = generateShipmentOrder;
exports.getShipmentDetails = getShipmentDetails;
exports.deleteShipmentByShipmentOrder = deleteShipmentByShipmentOrder;
exports.updateShipmentStatus = updateShipmentStatus;
exports.getAllShipments = getAllShipments;