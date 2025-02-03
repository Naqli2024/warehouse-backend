const sourceDepartment = require("../models/sourceDepartment");

const createSourceDepartment = async (req, res) => {
  try {
    const departmentExists = await sourceDepartment.findOne({
      $or: [
        {
          departmentName: req.body.departmentName,
        },
        { departmentCode: req.body.departmentCode },
      ],
    });

    if (departmentExists) {
      return res.status(409).json({
        success: false,
        message: `Department: ${req.body.departmentName} or department code: ${req.body.departmentCode} already exists.`,
        data: null,
      });
    }

    if (req.body.status) {
      req.body.status =
        req.body.status.charAt(0).toUpperCase() +
        req.body.status.slice(1).toLowerCase();
    }
    const newSourceDepartment = new sourceDepartment(req.body);
    await newSourceDepartment.save();

    return res.status(200).json({
      success: true,
      data: newSourceDepartment,
      message: "New source department created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const getAllSourceDepartment = async (req, res) => {
  try {
    const allSourceDepartment = await sourceDepartment.find();
    if (!allSourceDepartment) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No source department exists",
      });
    }
    return res.status(200).json({
      success: true,
      data: allSourceDepartment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
};

const deleteSourceDepartmentByDepartmentCode = async (req, res) => {
  const { id } = req.params;
  try {
    const foundDept = await sourceDepartment.findOneAndDelete({
      departmentCode: id,
    });
    if (!foundDept) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Soruce department not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: foundDept,
      message: "Source Department Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.createSourceDepartment = createSourceDepartment;
exports.getAllSourceDepartment = getAllSourceDepartment;
exports.deleteSourceDepartmentByDepartmentCode =
  deleteSourceDepartmentByDepartmentCode;
