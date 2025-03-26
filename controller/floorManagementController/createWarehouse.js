const Warehouse = require("../../models/floorManagementModel/warehouseModel");

const createWarehouse = async (req, res) => {
  try {
    const newWarehouse = new Warehouse(req.body);
    await newWarehouse.save();

    return res.status(201).json({
      success: true,
      data: newWarehouse,
      message: "Warehouse created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getWarhouses = async (req, res) => {
  try {
    const allWarehouses = await Warehouse.find();
    if (!allWarehouses || allWarehouses.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No warehouse found",
      });
    }
    return res.status(200).json({
      success: true,
      data: allWarehouses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouseFound = await Warehouse.findByIdAndDelete(id)
    if (!warehouseFound) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Warehouse not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: warehouseFound,
      message: "Warehouse deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const createSpace = async (req, res) => {
  const { warehouseId, category, space } = req.body;

  try {
    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    // Check if the category exists
    if (!warehouse.spaceConfiguration[category]) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Replace the spaces array with the new data
    warehouse.spaceConfiguration[category].spaces = space;

    await warehouse.save();

    res
      .status(200)
      .json({ message: "Warehouse space updated successfully", warehouse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSpaceStructure = async (req, res) => {
  const {
    warehouseId,
    category,
    spaceName,
    noOfRacks,
    noOfStacks,
    noOfLevels,
    boxPerPallet,
    palletPerUnit,
  } = req.body;

  try {
    // Validate category
    const validCategories = ["rawMaterials", "finishedProduct", "spareParts"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category specified" });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const spaceConfig = warehouse.spaceConfiguration[category];

    if (!spaceConfig || !spaceConfig.spaces) {
      return res
        .status(404)
        .json({ message: `No spaces found in ${category}` });
    }

    // Find the space by name
    const space = spaceConfig.spaces.find((s) => s.spaceName === spaceName);

    if (!space) {
      return res
        .status(404)
        .json({ message: `Space '${spaceName}' not found in ${category}` });
    }

    // Update space details
    space.noOfRacks = noOfRacks;
    space.noOfStacks = noOfStacks;
    space.noOfLevels = noOfLevels;
    space.boxPerPallet = boxPerPallet;
    space.palletPerUnit = palletPerUnit;

    await warehouse.save();

    res
      .status(200)
      .json({ message: "Space details updated successfully", data: warehouse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createWarehouse = createWarehouse;
exports.getWarhouses = getWarhouses;
exports.createSpace = createSpace;
exports.createSpaceStructure = createSpaceStructure;
exports.deleteWarehouseById = deleteWarehouseById;
