const { newEmployeeModel } = require("../models/newEmployeeModel");
const { employeeJobRolesModel } = require("../models/newEmployeeModel");

/*************** CRUD Create Employee ***************/
const CreateEmployee = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const employeeExists = await newEmployeeModel.findOne({
      emailId: req.body.emailId,
    });

    if (employeeExists) {
      return res.status(409).json({
        success: false,
        message: `EmailId: ${req.body.emailId} already exists.`,
        data: null,
      });
    }

    if (password !== confirmPassword) {
      return res.status(409).json({
        success: false,
        message: "Password and ConfirmPassword does not match",
        data: null,
      });
    }

    // Save only filename in profile.fileName field
    const profileImageFileName = req.file ? req.file.filename : null;

    const newEmployee = new newEmployeeModel({
      ...req.body,
      profile: { fileName: profileImageFileName },
    });
    await newEmployee.save();

    return res.status(200).json({
      success: true,
      data: newEmployee,
      message: "New employee created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeExists = await newEmployeeModel.findOne({ employeeId: id });
    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Employee not exists",
      });
    }

    // If a new profile image is uploaded, update it
    let updatedData = { ...req.body };
    if (req.file) {
      updatedData.profile = { fileName: req.file.filename };
    }

    const updatedEmployee = await newEmployeeModel.findOneAndUpdate(
      { employeeId: id },
      { $set: updatedData },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: "Employee details updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const allEmployee = await newEmployeeModel.find();
    if (!allEmployee) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No Employee exists",
      });
    }
    return res.status(200).json({
      success: true,
      data: allEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const getEmployeeByEmployeeId = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await newEmployeeModel.findOne({ employeeId: id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Employee not found for Employee Id ${employee.employeeId}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: employee,
      message: "Employee details fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteEmployeeByEmployeeId = async (req, res) => {
  const { id } = req.params;
  try {
    const foundEmployee = await newEmployeeModel.findOneAndDelete({
      employeeId: id,
    });
    if (!foundEmployee) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Employee not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: foundEmployee,
      message: "Employee Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const generateEmployeeId = async (req, res) => {
  try {
    let employeeId;
    const employeeExists = await newEmployeeModel
      .findOne()
      .sort({ createdAt: -1 })
      .select("employeeId");
    if (employeeExists && employeeExists.employeeId) {
      const lastEmployeeId = parseInt(
        employeeExists.employeeId.split("-")[1] || "0",
        10,
        10
      );
      const updatedEmployeeId = lastEmployeeId + 1;
      employeeId = `ID-${updatedEmployeeId.toString().padStart(3, "0")}`;
    } else {
      employeeId = `ID-001`;
    }
    return res.status(200).json({
      success: true,
      data: employeeId,
      message: "Generated new employee ID",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/****************CRUD Employee Job Roles*****************/
const addJobRoles = async (req, res) => {
  try {
    const { jobTitles, department } = req.body;

    // Function to normalize array values (case-insensitive)
    const normalizeArray = (arr) =>
      [...new Set(arr.map((item) => item.trim().toLowerCase()))];

    // Find existing job roles
    let existingRoles = await employeeJobRolesModel.findOne();

    if (!existingRoles) {
      // If no roles exist, create a new document
      existingRoles = new employeeJobRolesModel({
        jobTitles: jobTitles ? normalizeArray(jobTitles) : [],
        department: department ? normalizeArray(department) : [],
      });
    } else {
      // Update job titles if provided
      if (jobTitles) {
        existingRoles.jobTitles = normalizeArray([
          ...existingRoles.jobTitles,
          ...jobTitles,
        ]);
      }

      // Update department if provided
      if (department) {
        existingRoles.department = normalizeArray([
          ...existingRoles.department,
          ...department,
        ]);
      }
    }

    // Save the updated data
    await existingRoles.save();

    return res.status(200).json({
      success: true,
      data: existingRoles,
      message: "Job roles updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const getJobRoles = async (req, res) => {
  try {
    const response = await employeeJobRolesModel.find();
    if (!response || response.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No Data Available",
      });
    }

    // Check if each entry contains _id, jobTitles, and department
    const filteredResponse = response.filter(
      (jobRoles) =>
        jobRoles._id &&
        Array.isArray(jobRoles.jobTitles) &&
        jobRoles.jobTitles.length > 0 &&
        Array.isArray(jobRoles.department) &&
        jobRoles.department.length > 0
    );
    if (filteredResponse.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No valid Job Roles Available",
      });
    }

    return res.status(200).json({
      success: true,
      data: filteredResponse,
      message: "Employee Job Roles Fetched",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const deleteJobRoles = async (req, res) => {
  try {
    const { jobTitles, department } = req.body;

    let existingRoles = await employeeJobRolesModel.findOne();

    if (!existingRoles) {
      return res.status(404).json({
        success: false,
        message: "Job roles not found",
      });
    }

    // Remove job titles if provided
    if (jobTitles) {
      existingRoles.jobTitles = existingRoles.jobTitles.filter(
        (title) => !jobTitles.includes(title)
      );
    }

    // Remove departments if provided
    if (department) {
      existingRoles.department = existingRoles.department.filter(
        (dept) => !department.includes(dept)
      );
    }

    await existingRoles.save();

    return res.status(200).json({
      success: true,
      data: existingRoles,
      message: "Job roles deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const editJobRoles = async (req, res) => {
  try {
    const { jobTitles, department } = req.body;
    
    let existingRoles = await employeeJobRolesModel.findOne();

    if (!existingRoles) {
      return res.status(404).json({
        success: false,
        message: "Job roles not found",
      });
    }

    // Update job titles if provided
    if (jobTitles) {
      existingRoles.jobTitles = existingRoles.jobTitles.map((title) =>
        jobTitles[title] ? jobTitles[title] : title
      );
    }

    // Update departments if provided
    if (department) {
      existingRoles.department = existingRoles.department.map((dept) =>
        department[dept] ? department[dept] : dept
      );
    }

    await existingRoles.save();

    return res.status(200).json({
      success: true,
      data: existingRoles,
      message: "Job roles updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.CreateEmployee = CreateEmployee;
exports.editEmployee = editEmployee;
exports.getAllEmployee = getAllEmployee;
exports.getEmployeeByEmployeeId = getEmployeeByEmployeeId;
exports.deleteEmployeeByEmployeeId = deleteEmployeeByEmployeeId;
exports.addJobRoles = addJobRoles;
exports.generateEmployeeId = generateEmployeeId;
exports.getJobRoles = getJobRoles;
exports.deleteJobRoles = deleteJobRoles;
exports.editJobRoles = editJobRoles;