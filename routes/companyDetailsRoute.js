const express = require("express");
const router = express.Router();
const { addCompanyDetails } = require("../controller/companyDetailsController");

router.post("/add-company-details", addCompanyDetails);

module.exports = router;
