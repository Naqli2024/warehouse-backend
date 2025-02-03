const express = require("express");
const router = express.Router();
const packgaeController = require("../controller/packageController");

router.post("/create-package", packgaeController.createPackage);
router.get("/generatePackageSlip", packgaeController.generatePackageSlip);
router.get("/getPackageDetailsByPackageSlip/:id", packgaeController.getPackageDetails);
router.delete('/deletePackageByPackageSlip/:id', packgaeController.deletePackageById);
router.get('/getAllPackage', packgaeController.getAllPackage);

module.exports = router;