const express = require("express");
const router = express.Router();
const employeeController = require("../controller/employeeController");
const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePhoto/"); // Folder to store images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

// Multer upload settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
    }
  },
});

router.post(
  "/createNewEmployee",
  upload.single("profile"),
  employeeController.CreateEmployee
);
router.put("/edit-employee/:id", upload.single("profile"), employeeController.editEmployee);
router.delete("/delete-employee/:id", employeeController.deleteEmployeeByEmployeeId);
router.get("/getEmployee", employeeController.getAllEmployee);
router.get('/getEmployeeByEmployeeId/:id', employeeController.getEmployeeByEmployeeId);
router.get("/generateEmployeeId", employeeController.generateEmployeeId);
router.post("/addJobRoles", employeeController.addJobRoles);
router.get("/getJobRoles", employeeController.getJobRoles);
router.delete("/deleteJobRoles", employeeController.deleteJobRoles);
router.put("/editJobRoles", employeeController.editJobRoles);

module.exports = router;
