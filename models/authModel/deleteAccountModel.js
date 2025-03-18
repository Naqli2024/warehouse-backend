const mongoose = require("mongoose");

const deletedAccountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  companyName: String,
  phoneNumber: String,
  password: String,
  country: String,
  state: String,
  city: String,
  accountType: String,
  isVerified: Boolean,
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: { type: Date, default: Date.now },
  passwordChangedAt: { type: Date, default: null },
  ReasonForDeletion: {
    reason: { type: String, default: "No reason provided" },
    feedback: { type: String, default: "No feedback provided" }
  }
});

const DeletedAccount = mongoose.model("DeletedAccount", deletedAccountSchema);
module.exports = DeletedAccount;