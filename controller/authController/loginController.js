const User = require("../../models/authModel/createAccountModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User does not exist",
      });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Incorrect Password",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Account not verified. Please verify your email.",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { emailId: user.emailId, id: user._id },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: "2h" }
    );

    // Set token in httpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "Strict", // Helps prevent CSRF attacks
      maxAge: 2 * 60 * 60 * 1000, // Expires in 2 hours
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          companyName: user.companyName,
          phoneNumber: user.phoneNumber,
          country: user.country,
          state: user.state,
          city: user.city,
          accountType: user.accountType,
          isVerified: user.isVerified,
        },
      },
      message: "Login Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0), // Expire the cookie immediately
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = { userLogin, logoutUser };
