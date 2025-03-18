const express = require("express");
const router = express.Router();
const creditNoteController = require("../controller/creditNoteController");

router.post('/create-creditNote', creditNoteController.createCreditNote);
router.get('/generateCreditNoteId', creditNoteController.generateCreditNoteId);
router.get('/getAllCreditNotes', creditNoteController.getAllCreditNotes);
router.delete('/deleteCreditNoteByCreditNoteId/:creditNoteId', creditNoteController.deleteCreditNoteByCreditNoteId);
router.put('/updateCreditNote/:creditNoteId', creditNoteController.updateCreditNote);
router.get('/getCreditNoteDetailsByCreditNoteId/:creditNoteId', creditNoteController.getCreditNoteDetailsByCreditNoteId);
router.get('/getCreditNoteDetailsByInvoiceId/:invoiceId', creditNoteController.getCreditNoteDetailsByInvoiceId);

module.exports = router;