const mongoose = require("mongoose");
const comapnyDetailsSchema = require("../companyDetailsModel");

const createAccountSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    accountType: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: String },
    passwordChangedAt: { type: Date, default: null },
    companyDetails: comapnyDetailsSchema
  },
  { timestamps: true }
);

const user = mongoose.model("user", createAccountSchema);
module.exports = user;
