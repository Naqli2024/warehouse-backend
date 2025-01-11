const purchase = require("../models/purchase");

const createPurchase = async (req, res) => {
  try {
    const purchaseData = req.body;
    const { extraFields, ...regularFields } = purchaseData;

    if (extraFields) {
      regularFields.extraFields = extraFields;
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

exports.createPurchase = createPurchase;
exports.getPurchaseList = getPurchaseList;
exports.findPurchase = findPurchase;
