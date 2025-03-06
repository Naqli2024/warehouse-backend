const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");

router.post("/createNewCustomer", customerController.updateOrCreateCustomer);
router.put(
  "/updateOrCreateCustomer/:_id",
  customerController.updateOrCreateCustomer
);
router.get("/getAllCustomers", customerController.getAllCustomers);
router.get(
  "/getCustomerDetailsById/:id",
  customerController.getCustomerDetailsById
);
router.post("/getCustomerDetailsByName", customerController.getCustomerDetailsByName);
router.delete("/deleteCustomerById/:id", customerController.deleteCustomerById);

module.exports = router;
