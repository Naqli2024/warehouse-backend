const Customer = require("../models/customerModel");
const Purchase = require("../models/purchase");

const updateOrCreateCustomer = async (req, res) => {
  try {
    const { basicInformation, billingAddress, shippingAddress } = req.body;
    const { _id } = req.params; 

    if (!_id) {
      // Create new customer
      if (!basicInformation || !basicInformation.companyName || !basicInformation.emailId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Missing required fields: companyName and emailId",
        });
      }

      const customerExist = await Customer.findOne({
        "basicInformation.companyName": basicInformation.companyName,
        "basicInformation.emailId": basicInformation.emailId,
      });

      if (customerExist) {
        return res.status(409).json({
          success: false,
          data: null,
          message: `Company Name: ${basicInformation.companyName} and Email: ${basicInformation.emailId} already exist`,
        });
      }

      const newCustomer = new Customer(req.body);
      await newCustomer.save();

      return res.status(201).json({
        success: true,
        data: newCustomer,
        message: "New customer created",
      });
    } else {
      // Update existing customer
      const customer = await Customer.findById(_id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "customer not found",
        });
      }

      // Update basicInformation, billing and shipping address if they are provided
      if (basicInformation) {
        customer.basicInformation = { ...customer.basicInformation, ...basicInformation };
      }
      if (billingAddress) {
        customer.billingAddress = { ...customer.billingAddress, ...billingAddress };
      }
      if (shippingAddress) {
        customer.shippingAddress = { ...customer.shippingAddress, ...shippingAddress };
      }

      await customer.save();

      return res.status(200).json({
        success: true,
        data: customer,
        message: "customer information updated",
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

const getAllCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find();
    if (!allCustomers) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No customers found",
      });
    }
    return res.status(200).json({
      success: true,
      data: allCustomers,
      message: "Customers fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getCustomerDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundCustomer = await Customer.findById({ _id: id });
    if (!foundCustomer) {
      res.status(404).json({
        message: "No customer found",
        success: false,
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      data: foundCustomer,
      message: "Customer details fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteCustomerById = async(req, res) => {
  const {id} = req.params;
  try {
    const customerFound = await Customer.findOneAndDelete({_id: id});
    if(!customerFound) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "customer not found"
      })
    }
    return res.status(200).json({
      success: true,
      data: customerFound,
      message: "Customer deleted successfully"
    })
  }catch(error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    })
  }
}

exports.updateOrCreateCustomer = updateOrCreateCustomer;
exports.getAllCustomers = getAllCustomers;
exports.getCustomerDetailsById = getCustomerDetailsById;
exports.deleteCustomerById = deleteCustomerById;