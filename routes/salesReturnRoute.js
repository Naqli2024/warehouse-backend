const express = require("express");
const router = express.Router();
const salesReturnController = require("../controller/salesReturnController");

router.post('/create-salesReturn', salesReturnController.createSalesReturn);
router.get('/generateSalesReturnNumber', salesReturnController.generateSaleReturnNumber);
router.get('/getAllSalesReturn', salesReturnController.getAllSalesReturn);
router.delete('/deleteSalesReturnBySalesReturnId/:id', salesReturnController.deleteSalesReturnBySalesReturnId);
router.get('/getSalesReturnBySalesOrderId/:salesOrderId', salesReturnController.getSalesReturnBySalesOrderId);

module.exports = router;