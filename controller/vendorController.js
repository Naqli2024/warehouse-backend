const Vendor = require("../models/newVendor");

const createNewVendor = async (req, res) => {
  try {
    const { basicInformation } = req.body;
    if (
      !basicInformation ||
      !basicInformation.companyName ||
      !basicInformation.emailId
    ) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Missing required fields: companyName and emailId",
      });
    }
    const vendorExist = await Vendor.findOne({
      "basicInformation.companyName": basicInformation.companyName,
      "basicInformation.emailId": basicInformation.emailId,
    });
    if (vendorExist) {
      return res.status(409).json({
        success: false,
        data: null,
        message: `Company Name: ${basicInformation.companyName} and Email: ${basicInformation.emailId} already exists`,
      });
    }
    const newVendor = new Vendor(req.body);
    await newVendor.save();

    return res.status(200).json({
      success: true,
      data: newVendor,
      message: "New vendor created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllvendors = async (req, res) => {
  try {
    const allVendors = await Vendor.find();
    if (!allVendors) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No vendors found",
      });
    }
    return res.status(200).json({
      success: true,
      data: allVendors,
      message: "Vendors fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

exports.createNewVendor = createNewVendor;
exports.getAllvendors = getAllvendors;
