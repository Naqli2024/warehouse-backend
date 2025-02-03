const express = require("express");
const router = express.Router();
const shipmentController = require("../controller/shipmentController");

router.post("/createShipment", shipmentController.createShipment);
router.get("/generateShipmentOrder", shipmentController.generateShipmentOrder);
router.get("/getShipmentDetails/:id", shipmentController.getShipmentDetails);
router.delete("/deleteShipmentByShipmentOrder/:shipmentOrder", shipmentController.deleteShipmentByShipmentOrder);
router.put("/updateShipmentStatus", shipmentController.updateShipmentStatus);
router.get("/getAllShipment", shipmentController.getAllShipments);

module.exports = router;
