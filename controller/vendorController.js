const Vendor = require("../models/newVendor");
const Purchase = require("../models/purchase");

const updateOrCreateVendor = async (req, res) => {
  try {
    const { basicInformation, billingAddress, shippingAddress } = req.body;
    const { _id } = req.params; 

    if (!_id) {
      // Create new vendor
      if (!basicInformation || !basicInformation.companyName || !basicInformation.emailId) {
        return res.status(400).json({
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
          message: `Company Name: ${basicInformation.companyName} and Email: ${basicInformation.emailId} already exist`,
        });
      }

      const newVendor = new Vendor(req.body);
      await newVendor.save();

      return res.status(201).json({
        success: true,
        data: newVendor,
        message: "New vendor created",
      });
    } else {
      // Update existing vendor
      const vendor = await Vendor.findById(_id);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Vendor not found",
        });
      }

      // Update basicInformation, billing and shipping address if they are provided
      if (basicInformation) {
        vendor.basicInformation = { ...vendor.basicInformation, ...basicInformation };
      }
      if (billingAddress) {
        vendor.billingAddress = { ...vendor.billingAddress, ...billingAddress };
      }
      if (shippingAddress) {
        vendor.shippingAddress = { ...vendor.shippingAddress, ...shippingAddress };
      }

      await vendor.save();

      return res.status(200).json({
        success: true,
        data: vendor,
        message: "Vendor information updated",
      });
    }
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

const getVendorDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundVendor = await Vendor.findById({ _id: id });
    if (!foundVendor) {
      res.status(404).json({
        message: "No vendor found",
        success: false,
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      data: foundVendor,
      message: "Vendor details fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const updateVendorWithPurchase = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const vendorName = `${firstName} ${lastName}`;

    const isMatchedVendor = await Vendor.findOne({
      "basicInformation.firstName": firstName,
      "basicInformation.lastName": lastName,
    });
    if (!isMatchedVendor) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Vendor not found",
      });
    }

    const purchase = await Purchase.find({ vendorName: vendorName });
    if (purchase.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `No purchase list found for this vendor: ${vendorName}`,
      });
    }
    isMatchedVendor.purchaseList = purchase;
    await isMatchedVendor.save();

    res.status(200).json({
      success: true,
      data: isMatchedVendor,
      message: "vendor with purchaseList has been updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteVendorById = async(req, res) => {
  const {id} = req.params;
  try {
    const vendorFound = await Vendor.findOneAndDelete({_id: id});
    if(!vendorFound) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "vendor not found"
      })
    }
    return res.status(200).json({
      success: true,
      data: vendorFound,
      message: "Vendor deleted successfully"
    })
  }catch(error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    })
  }
}

exports.updateOrCreateVendor = updateOrCreateVendor;
exports.getAllvendors = getAllvendors;
exports.getVendorDetailsById = getVendorDetailsById;
exports.updateVendorWithPurchase = updateVendorWithPurchase;
exports.deleteVendorById = deleteVendorById;