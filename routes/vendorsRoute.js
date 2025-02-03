const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendorController");

router.post("/createNewVendor",vendorController.createNewVendor);
router.get("/getAllVendors", vendorController.getAllvendors);

module.exports = router;