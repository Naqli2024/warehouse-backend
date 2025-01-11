const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchaseController');

router.post('/create-purchase', purchaseController.createPurchase);
router.get('/getPurchaseList', purchaseController.getPurchaseList);
router.get('/getPurchaseById/:id', purchaseController.findPurchase);
router.post('/getPurchase', purchaseController.findPurchase);

module.exports = router;