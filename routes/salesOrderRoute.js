const express = require('express');
const router = express.Router();
const saleOrderController = require('../controller/salesOrderController');

router.post('/create-saleOrder', saleOrderController.createSalesorder);
router.get('/getAllSalesorders', saleOrderController.getAllSalesOrders);
router.get('/getSaleOrderBySaleOrderId/:saleOrderId', saleOrderController.getSaleOrderBySalesOrderId);

module.exports = router;