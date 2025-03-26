const User = require("../../models/authModel/createAccountModel");
const bcrypt = require("bcryptjs");
const sendVerificationEmail = require("../../utils/emailService");
const crypto = require("crypto");
const DeletedAccount = require("../../models/authModel/deleteAccountModel");
const mongoose = require("mongoose");

const createAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      companyName,
      phoneNumber,
      password,
      confirmPassword,
      country,
      state,
      city,
      accountType,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    // const hashedToken = await bcrypt.hash(verificationToken, 10); // Store hashed token
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours


    const newUser = new User({
      firstName,
      lastName,
      emailId,
      companyName,
      phoneNumber,
      password: hashedPassword,
      country,
      state,
      city,
      accountType,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: tokenExpiry,
    });

    await newUser.save();

    await sendVerificationEmail(emailId, verificationToken);

    return res
      .status(200)
      .json({
        success: true,
        message: "Account created. Please check your email to verify.",
        data: {
          isVerified: newUser.isVerified
        }
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const editAccount = async (req, res) => {
  try {
    const { id } = req.params;  
    const {
      firstName,
      lastName,
      emailId,
      companyName,
      phoneNumber,
      country,
      state,
      city,
      accountType,
    } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check for email uniqueness and trigger verification if the email is updated
    let emailChanged = false;
    if (emailId && emailId !== user.emailId) {
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Trigger email verification
      emailChanged = true;
      user.emailId = emailId;
      user.isVerified = false;  

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;  // 24 hours

      await sendVerificationEmail(emailId, verificationToken);
    }

    // Update the account details
    await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          emailId: user.emailId,  // Use the potentially updated email
          companyName: companyName || user.companyName,
          phoneNumber: phoneNumber || user.phoneNumber,
          country: country || user.country,
          state: state || user.state,
          city: city || user.city,
          accountType: accountType || user.accountType,
          isVerified: user.isVerified,  // Update verification status
          verificationToken: user.verificationToken,
          verificationTokenExpires: user.verificationTokenExpires,
        },
      },
      { new: true, runValidators: true }
    );

    // Query again to exclude the password field
    const updatedUser = await User.findById(id).select('-password'); 

    // Response message based on email change
    const message = emailChanged
      ? "Account updated successfully. Please verify your new email."
      : "Account updated successfully.";

    return res.status(200).json({
      success: true,
      message,
      data: {
        user: updatedUser
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAccount = async(req, res) => {
  try { 
    const {id} = req.params;
    const { reason, feedback } = req.body; 

     // Validate MongoDB ID before querying
     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find the user before deleting it
    const deletedUser = await User.findById(id);
    if(!deletedUser) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User or Admin does not exsits"
      })
    }

     // Clone the user account into `deletedAccounts` collection
     const clonedAccount = new DeletedAccount({
      ...deletedUser.toObject(),   
      ReasonForDeletion: {
        reason: reason || "No reason provided",
        feedback: feedback || "No feedback provided",
      },
    });

    await clonedAccount.save();

    // Delete the user after cloning
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    })
  } catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    // Find user with unverified email & matching token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // Ensure token is still valid
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove token after verification
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
      data: { isVerified: user.isVerified },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createAccount, verifyEmail, editAccount, deleteAccount };
