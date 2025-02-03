const { default: mongoose } = require("mongoose");

const sourceDepartmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    departmentCode: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    contactPerson: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], required: true },
  },
  { timeStamps: true }
);

const sourceDepartmentModel = mongoose.model(
  "sourceDepartment",
  sourceDepartmentSchema
);

module.exports = sourceDepartmentModel;
