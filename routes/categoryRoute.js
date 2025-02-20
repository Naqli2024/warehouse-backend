const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post('/createCategory', categoryController.createCategory);
router.post('/category/subcategory', categoryController.createSubCategory);
router.post('/category/product', categoryController.addProduct);
router.get('/getAllCategories', categoryController.getAllCategories);
router.delete('/deleteCategory/:id', categoryController.deleteCategories);

module.exports = router;