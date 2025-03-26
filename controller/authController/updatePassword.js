const User = require("../../models/authModel/createAccountModel");
const bcrypt = require("bcryptjs");

const updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // Check passwords are same
    if (newPassword !== confirmNewPassword) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "Password and confirmPassword do not match",
      });
    }

    // check if userId is exist in User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User does not exists",
      });
    }

    // check if the current password is correct with the user collection password
    const isMatchPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isMatchPassword) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "Current password is incorrect",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Store the timestamp of the password change
    user.passwordChangedAt = new Date();

    // save the new password
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        passwordChangedAt: user.passwordChangedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { emailId, newPassword, confirmNewPassword } = req.body;

    // Validate that passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "New password and confirm password do not match",
      });
    }

    // Check if the user exists with the given emailId
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User with this email does not exist",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and set the `passwordChangedAt` timestamp
    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date();

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: {
        passwordChangedAt: user.passwordChangedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

module.exports = { updatePassword, forgetPassword };
