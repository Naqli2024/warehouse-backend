const inventory = require("../models/createInventory");

const createInventory = async (req, res) => {
  try {
    const savedInventory = new inventory({ ...req.body });
    await savedInventory.save();

    return res.json({
      success: true,
      message: "Inventory created successfully",
      data: savedInventory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getInventories = async (req, res) => {
  try {
    const inventories = await inventory.find();
    if (!inventories) {
      return res.status(404).json({
        message: "No inventories",
        data: null,
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Inventories fetched!",
      data: inventories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const findInventoryBySku = async (req, res) => {
  const { sku } = req.body;
  try {
    const response = await inventory.findOne({ sku: sku });
    return res.status(200).json({
      success: true,
      message: "Inventory fetched successfully   ",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.createInventory = createInventory;
exports.getInventories = getInventories;
exports.findInventoryBySku = findInventoryBySku;
