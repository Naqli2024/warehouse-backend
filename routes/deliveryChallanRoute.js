const express = require("express");
const router = express.Router();
const challanController = require("../controller/deliveryChallan");

router.post("/create-challan", challanController.createDeliveryChallan);
router.get("/getAllChallan", challanController.getAllChallans);
router.get(
  "/getChallanBySalesOrderId/:id",
  challanController.getChallanBySalesOrderId
);
router.get("/deliveryChallan", challanController.generateDeliveryChallan);
router.delete("/deleteChallanBySaleOrderId/:id", challanController.deleteChallanBySalesOrderId);

module.exports = router;
