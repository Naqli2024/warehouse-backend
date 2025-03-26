const express = require("express");
const router = express.Router();
const floorManagementController = require("../controller/floorManagementController/createWarehouse");

router.post('/create-warehouse',floorManagementController.createWarehouse);
router.get('/getAllWarehouses', floorManagementController.getWarhouses);
router.post('/create-space', floorManagementController.createSpace);
router.post('/create-space-structure', floorManagementController.createSpaceStructure);
router.delete('/delete-warehouse/:id', floorManagementController.deleteWarehouseById);

module.exports = router;