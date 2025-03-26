const express = require("express");
const router = express.Router();
const {
  createAccount,
  verifyEmail,
  editAccount,
  deleteAccount,
} = require("../controller/authController/createAccount");
const {
  userLogin,
  logoutUser,
} = require("../controller/authController/loginController");
const authStatus = require("../controller/authController/authStatus");
const verifyToken = require("../utils/verifyToken");
const {
  updatePassword,
  forgetPassword
} = require("../controller/authController/updatePassword");

router.post("/create-account", createAccount);
router.post("/verify-email", verifyEmail);
router.post("/login", userLogin);
router.post("/logout", logoutUser);
router.get("/auth-status", verifyToken, authStatus);
router.post("/update-password", updatePassword);
router.post("/forget-password", forgetPassword);
router.put("/edit-account/:id", editAccount);
router.delete("/delete-account/:id", deleteAccount);

module.exports = router;
