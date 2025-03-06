const express = require("express");
const router = express.Router();
const salesInvoiceController = require("../controller/salesInvoiceController");

router.post('/create-salesInvoice', salesInvoiceController.createSalesInvoice);
router.put('/edit-salesInvoice', salesInvoiceController.editSalesInvoice);
router.delete('/delete-salesInvoice/:invoiceId', salesInvoiceController.deleteSalesInvoice);
router.get("/getAllInvoices", salesInvoiceController.getAllInvoice);
router.get("/generateInvoiceId", salesInvoiceController.generateInvoiceId);
router.get("/generateOrderNo", salesInvoiceController.generateOrderNo);
router.get('/getInvoiceDetails/:salesOrderId', salesInvoiceController.getSalesInvoiceDetails);
router.put("/updateInvoiceWithCredits", salesInvoiceController.updateInvoiceWithCredits);

module.exports = router;