const { default: mongoose } = require("mongoose");

const billingAddressSchema = new mongoose.Schema({
  country: { type: String, required: false },
  state: { type: String, required: false },
  city: { type: String, required: false },
  street: { type: String, required: false },
  zipCode: { type: String, required: false },
  phoneNo: { type: String, required: false },
});

const basicInformationSchema = new mongoose.Schema({
  honorifics: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  companyName: { type: String, required: false },
  emailId: { type: String, required: false },
  Mobile: { type: String, required: false },
  landLine: { type: String, required: false },
  website: { type: String, required: false },
  gst: { type: String, required: false },
});

const shippingAddressSchema = new mongoose.Schema({
  country: { type: String, required: false },
  state: { type: String, required: false },
  city: { type: String, required: false },
  street: { type: String, required: false },
  zipCode: { type: String, required: false },
  phoneNo: { type: String, required: false },
});

const createNewVendorSchema = new mongoose.Schema({
  basicInformation: basicInformationSchema,
  billingAddress: billingAddressSchema,
  shippingAddress: shippingAddressSchema,
});

const newVendor = mongoose.model("vendor", createNewVendorSchema);
module.exports = newVendor;
