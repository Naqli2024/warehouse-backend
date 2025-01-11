const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');

router.post('/create-inventory', inventoryController.createInventory);
router.get('/getInventory', inventoryController.getInventories);
router.post('/getInventoryBySku', inventoryController.findInventoryBySku);

module.exports = router;