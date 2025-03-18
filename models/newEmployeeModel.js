const { default: mongoose } = require("mongoose");

const newEmployeeSchema = new mongoose.Schema(
  {
    employeeId: {type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailId: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    mobileNo: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    dob: { type: String, required: true },
    profile: {
      fileName: { type: String },
    },
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    typeOfHire: { type: String, required: true },
    dateOfJoining: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, required: true },
    accessTo: { type: String, required: true },
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      required: true,
      default: "Active",
    },
  },
  { timestamps: true }
);

const employeeJobRoles = new mongoose.Schema(
  {
    jobTitles: [{ type: String }],
    department: [{ type: String }],
  },
  { timestamps: true }
);

const newEmployeeModel = mongoose.model("employees", newEmployeeSchema);
const employeeJobRolesModel = mongoose.model("empJobRole", employeeJobRoles);

module.exports = { newEmployeeModel, employeeJobRolesModel };
