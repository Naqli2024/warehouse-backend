const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendorController");

router.post("/createNewVendor",vendorController.updateOrCreateVendor);
router.put("/updateOrCreateVendor/:_id", vendorController.updateOrCreateVendor);
router.get("/getAllVendors", vendorController.getAllvendors);
router.get("/getVendorDetailsById/:id", vendorController.getVendorDetailsById);
router.post('/updateVendorWithPurchase', vendorController.updateVendorWithPurchase);
router.delete('/deleteVendorById/:id', vendorController.deleteVendorById);

module.exports = router;