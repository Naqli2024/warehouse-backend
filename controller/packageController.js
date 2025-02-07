const Package = require("../models/createPackage");
const SalesOrder = require("../models/createSalesOrder");
const Shipment = require("../models/shipment");

const createPackage = async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    const saleOrderExists = await Package.findOne({
      salesOrderId: req.body.salesOrderId,
    });
    if (saleOrderExists) {
      return res.status(500).json({
        message: "Saleorder already packed",
        success: false,
      });
    }

    const confirmedPackedStatus = await SalesOrder.findOne({
      salesOrderId: req.body.salesOrderId,
    });
    if (!confirmedPackedStatus) {
      return res.status(404).json({
        message: `Sales order ${req.body.salesOrderId} not found.`,
        success: false,
      });
    }
    // Update packed status
    confirmedPackedStatus.packed = "Confirmed";
    await confirmedPackedStatus.save();

    await newPackage.save();
    return res.status(200).json({
      message: "New package added",
      success: true,
      data: newPackage,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

const generatePackageSlip = async (req, res) => {
  try {
    let packageUniqueGenerated = false;
    let packageSlip;

    while (!packageUniqueGenerated) {
      packageSlip = `PK-${Math.floor(100 + Math.random() * 900)}`;
      const uniquePackageSlip = await Package.findOne({ packageSlip });
      if (!uniquePackageSlip) {
        packageUniqueGenerated = true;
      }
    }
    return res.status(200).json({
      success: true,
      message: "Package Slip generated",
      data: packageSlip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getPackageDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const packageDetail = await Package.findOne({
      $or: [{ packageSlip: id }, { salesOrderId: id }],
    });
    if (!packageDetail) {
      return res.status(200).json({
        success: false,
        data: null,
        message: "Package details not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: packageDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deletePackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const isShipped = await Shipment.findOne({ packageSlip: id });
    
    // Check if the package is already shipped
    if (isShipped) {
      return res.status(409).json({
        success: false,
        data: null,
        message: `Cannot delete package. Sale order ${isShipped.salesOrderId} has already been shipped.`,
      });
    }

    // Proceed to delete the package if it's not shipped
    const deletedPackage = await Package.findOneAndDelete({ packageSlip: id });
    if (!deletedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
        data: null,
      });
    }

    // Update the sales order status to "Draft" after deleting the package
    const salesOrder = await SalesOrder.findOne({
      salesOrderId: deletedPackage.salesOrderId,
    });
    if (salesOrder) {
      salesOrder.packed = "Draft";
      await salesOrder.save();
    }
  
    return res.status(200).json({
      success: true,
      message: "Package deleted",
      data: deletedPackage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllPackage = async (req, res) => {
  try {
    const allPackages = await Package.find();
    if (!allPackages) {
      res.status(404).json({
        success: false,
        data: null,
        message: "No package found",
      });
    }
    return res.status(200).json({
      success: true,
      data: allPackages,
      message: "Package List fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

exports.createPackage = createPackage;
exports.generatePackageSlip = generatePackageSlip;
exports.getPackageDetails = getPackageDetails;
exports.deletePackageById = deletePackageById;
exports.getAllPackage = getAllPackage;
