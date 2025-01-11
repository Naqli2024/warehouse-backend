const express = require('express');
const router = express.Router();
const saleOrderController = require('../controller/salesOrderController');

router.post('/create-saleOrder', saleOrderController.createSalesorder);
router.get('/getAllSalesorders', saleOrderController.getAllSalesOrders);

module.exports = router;