const purchase = require("../models/purchase");
const Category = require("../models/categoryModel");

const createPurchase = async (req, res) => {
  try {
    const purchaseData = req.body;
    const { extraFields, productName, category, subCategory, ...regularFields } = purchaseData;

    if (!category || !subCategory || !productName) {
      return res.status(400).send({
        success: false,
        message: "Category, subCategory, and productName are required.",
      });
    }

    // Convert productName to lowercase
    const lowerProductName = productName.toLowerCase();
    const lowerCategory = category.toLowerCase();
    const lowerSubCategory = subCategory.toLowerCase();
    regularFields.productName = lowerProductName;
    regularFields.category = lowerCategory;
    regularFields.subCategory = lowerSubCategory;

    if (extraFields) {
      regularFields.extraFields = extraFields;
    }

    const categoryFound = await Category.findOne({categoryName: lowerCategory})
    if(!categoryFound) {
      return res.json({
        success: false,
        data: null,
        message: "Category not found"
      })
    }

    const subCategoryDoc = categoryFound.subCategories.find((cat) => cat.name === lowerSubCategory);
    if(!subCategoryDoc) {
      return res.json({
        success: false,
        data: null,
        message: "Sub category not found"
      })
    }

    if(!subCategoryDoc.productList.includes(lowerProductName)) {
      subCategoryDoc.productList.push(lowerProductName)
      await categoryFound.save()
    }

    const savedPurchase = new purchase(regularFields);
    const newPurchase = await savedPurchase.save();

    res.status(200).send({
      success: true,
      message: "Purchased Item added successfully",
      data: newPurchase,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getPurchaseList = async (req, res) => {
  try {
    const purchaseList = await purchase.find();
    if (purchaseList) {
      return res.status(200).json({
        success: true,
        message: "Purchase List Fetched Successfully",
        data: purchaseList,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "No purchase list",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const findPurchase = async (req, res) => {
  const id = req.params.id;
  const { itemName, sku } = req.body;

  try {
    if (id) {
      purchaseRecord = await purchase.findById(id);
    } else if (itemName) {
      purchaseRecord = await purchase.findOne({ productName: itemName });
    } else if (sku) {
      purchaseRecord = await purchase.findOne({ sku: sku });
    } else {
      return res.status(400).json({
        success: false,
        message: "Either purchaseId or Name required",
      });
    }

    if (!purchaseRecord) {
      return res.status(404).json({
        message: "Purchase Not Found",
        success: false,
        data: null,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: purchaseRecord,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      sata: null,
    });
  }
};

const deletePurchaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const purchaseFound = await purchase.findByIdAndDelete({ _id: id });
    if (!purchaseFound) {
      res.status(404).json({
        success: false,
        data: null,
        message: "No purchase found",
      });
    }
    return res.status(200).json({
      success: true,
      data: purchaseFound,
      message: "Purchase item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const generateSkuForProduct = async (req, res) => {
  try {
    let skuCode;

    const skuFound = await purchase
      .findOne()
      .sort({ createdAt: -1 })
      .select("sku");
    if (skuFound && skuFound.sku) {
      const lastSku = parseInt(skuFound.sku.split("-")[1]);
      const newSku = lastSku + 1;
      skuCode = `SKU-${newSku.toString().padStart(4, "0")}`;
    } else {
      skuCode = "SKU-0001";
    }
    return res.status(200).json({
      success: true,
      data: skuCode,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const generateHsnCode = async (req, res) => {
  try {
    let newHsn;
    let isDuplicate = true;

    while (isDuplicate) {
      newHsn = Math.floor(1000 + Math.random() * 9000);
      const hsnFound = await purchase.findOne({ hsnCode: newHsn });
      if (!hsnFound) {
        isDuplicate = false;
      }
    }
    return res.status(200).json({
      success: true,
      data: newHsn
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getPurchaseByProductName = async (req, res) => {
  try {
    let productNames = [];

    // Support both array & single param
    if(Array.isArray(req.body.productNames)) {
      productNames = req.body.productNames
    } else {
      productNames = [req.body.productNames]
    } 
    productNames = productNames.map(name => name.toLowerCase()); 

    // Fetch all matching products
    const foundProducts = await purchase.find({ productName: { $in: productNames } });

    if (foundProducts.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: foundProducts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

exports.createPurchase = createPurchase;
exports.getPurchaseList = getPurchaseList;
exports.findPurchase = findPurchase;
exports.deletePurchaseById = deletePurchaseById;
exports.generateSkuForProduct = generateSkuForProduct;
exports.generateHsnCode = generateHsnCode;
exports.getPurchaseByProductName = getPurchaseByProductName;