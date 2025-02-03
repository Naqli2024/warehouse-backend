const express = require('express');
const router = express.Router();
const sourceDepartmentController = require("../controller/sourceDepartmentController");

router.post('/createSourceDepartment', sourceDepartmentController.createSourceDepartment);
router.get('/getSourceDepartment', sourceDepartmentController.getAllSourceDepartment);
router.delete('/deleteSourceDepartment/:id', sourceDepartmentController.deleteSourceDepartmentByDepartmentCode);

module.exports = router;