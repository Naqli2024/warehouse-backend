const Category = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

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
      message: "New category added"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const createSubCategory = async (req, res) => {
    try {
      const { categoryName, subCategoryName } = req.body;
  
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
      const { categoryName, subCategoryName, productName } = req.body;
  
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
  
  exports.createCategory = createCategory;
  exports.createSubCategory = createSubCategory;
  exports.addProduct = addProduct;