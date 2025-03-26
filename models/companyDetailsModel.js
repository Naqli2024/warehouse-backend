const mongoose = require("mongoose");

const comapnyDetailsSchema = new mongoose.Schema({
  profileInformation: {
    companyLogo: {
      fileName: { type: String },
    },
    companyId: { type: String, required: true },
    companyType: { type: String, required: true },
    website: { type: String, required: false },
  },
  companyLocation: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
  },
  companyAddress: {
    streetName1: { type: String, required: true },
    streetName2: { type: String, required: false },
    zipCode: { type: String, required: true },
    faxNumber: { type: String, required: true },
    mobileNumber: { type: String, required: true },
  },
  socialMedia: {
    twitter: { type: String, required: false },
    facebook: { type: String, required: false },
    linkedIn: { type: String, required: false },
    instagram: { type: String, required: false },
  },
});

module.exports = comapnyDetailsSchema