const Category = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName.trim().toLowerCase();

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists!",
      });
    }

    const newCategory = new Category({
      categoryName,
      subCategories: [],
    });
    await newCategory.save();
    return res.status(200).json({
      success: true,
      data: newCategory,
      message: "New category added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const createSubCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName.trim().toLowerCase();
    const subCategoryName = req.body.subCategoryName.trim().toLowerCase();

    // Find the category
    const category = await Category.findOne({ categoryName });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    // Check if subcategory already exists
    const subCategoryExists = category.subCategories.find(
      (sub) => sub.name === subCategoryName
    );

    if (subCategoryExists) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists!",
      });
    }

    // Add the new subcategory
    category.subCategories.push({ name: subCategoryName, productList: [] });
    await category.save();

    return res.status(201).json({
      success: true,
      data: category,
      message: "Subcategory added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    let { categoryName, subCategoryName, productName } = req.body;
    categoryName = categoryName.trim().toLowerCase();
    subCategoryName = subCategoryName.trim().toLowerCase();
    productName = productName.trim().toLowerCase();

    // Find the category
    const category = await Category.findOne({ categoryName });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    // Find the subcategory
    const subCategory = category.subCategories.find(
      (sub) => sub.name === subCategoryName
    );

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found!",
      });
    }

    // Check if product already exists
    if (subCategory.productList.includes(productName)) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in this subcategory!",
      });
    }

    // Add product to the subcategory
    subCategory.productList.push(productName);
    await category.save();

    return res.status(201).json({
      success: true,
      data: category,
      message: "Product added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No category found",
      });
    }
    return res.status(200).json({
      success: true,
      data: categories,
      message: "Categories fetched",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteCategories = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete({ _id: id });
    if (deletedCategory) {
      return res.status(200).json({
        success: true,
        data: deletedCategory,
        message: "Category Deleted",
      });
    }
    // If not a category, check if it's a subcategory
    const updatedCategory = await Category.findOneAndUpdate(
      { "subCategories._id": id },
      { $pull: { subCategories: { _id: id } } },
      { new: true }
    );
    if (updatedCategory) {
      return res.status(200).json({
        success: true,
        data: updatedCategory,
        message: "Subcategory deleted successfully",
      });
    }

    return res.status(404).json({
      success: false,
      data: null,
      message: "Category or subcategory not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

exports.createCategory = createCategory;
exports.createSubCategory = createSubCategory;
exports.addProduct = addProduct;
exports.getAllCategories = getAllCategories;
exports.deleteCategories = deleteCategories;
