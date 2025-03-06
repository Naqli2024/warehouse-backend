const SalesReturn = require("../models/salesReturn");
const Inventory = require("../models/createInventory");
const Shipment = require("../models/shipment");
const SalesInvoice = require("../models/salesInvoiceModel");

const createSalesReturn = async (req, res) => {
  try {
    const { customerName, salesOrderId, itemDetails } = req.body;

    const isShipped = await Shipment.findOne({salesOrderId})
    if(!isShipped || isShipped.shipmentStatus !== "Shipped") {
      return res.status(404).json({
        success: false,
        data: null,
        message: `SaleOrder not yet shipped`
      })
    }

    const isInvoiced = await SalesInvoice.findOne({salesOrderId})
    if(!isInvoiced || isInvoiced.invoiceId !== req.body.invoiceNumber) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Invoice not found for sale order ${salesOrderId}.Please create an invoice`
      })
    }
 
    if (!customerName || !salesOrderId) {
      return res.status(400).json({
        success: false,
        message: "Customer name and sales order ID are required",
      });
    }

    // Check if sales order has already been returned
    const existingReturn = await SalesReturn.findOne({ salesOrderId });
    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: `Sales order ${salesOrderId} has already been returned`,
      });
    }

    // Ensure itemDetails exists and is an array
    if (!Array.isArray(itemDetails) || itemDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Item details are required and should be an array",
      });
    }

    // Calculate totals
    let totalReturned = 0,
      totalReceivableQty = 0,
      totalCreditQty = 0,
      totalReturnQty = 0;

    itemDetails.forEach((item) => {
      totalReturned += Number(item.returned) || 0;
      totalReceivableQty += Number(item.receivableQty) || 0;
      totalCreditQty += Number(item.creditQty) || 0;
      totalReturnQty += Number(item.returnQty) || 0;
    });

    // Determine status
    let status;
    if (totalReceivableQty > 0) {
      status =
        totalReceivableQty === totalCreditQty + totalReturned
          ? "Closed"
          : "Approved";
    } else {
      status = totalReturned === totalReturnQty ? "Closed" : "Approved";
    }

    // Create sales return with computed status
    const newSalesReturn = new SalesReturn({ ...req.body, status });
    await newSalesReturn.save();

    // Update inventory in parallel for better performance
    await Promise.all(
      itemDetails.map(async (item) => {
        const { sku, returned } = item;
        const updatedQuantity = Number(returned) || 0;

        if (sku && updatedQuantity > 0) {
          const inventoryItem = await Inventory.findOne({ sku });

          if (inventoryItem) {
            inventoryItem.quantity =
              (Number(inventoryItem.quantity) || 0) + updatedQuantity;
            await inventoryItem.save();
          } else {
            return res.status(500).json({
              success: false,
              data: null,
              message: `Inventory item with SKU ${sku} not found`
            })
          }
        }
      })
    );

    return res.status(201).json({
      success: true,
      data: newSalesReturn,
      message: "Sales return created successfully",
    });

  } catch (error) {
    console.error("Error in createSalesReturn:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateSaleReturnNumber = async (req, res) => {
  try {
    let salesReturn;
    const salesReturnExists = await SalesReturn.findOne()
      .sort({ createdAt: -1 })
      .select("salesReturnId");
    if (salesReturnExists && salesReturnExists.salesReturnId) {
      const lastSalesReturn = parseInt(
        salesReturnExists.salesReturnId.split("-")[1],
        10
      );
      const updatedSalesReturn = lastSalesReturn + 1;
      salesReturn = `RA-${updatedSalesReturn.toString().padStart(3, "0")}`;
    } else {
      salesReturn = `RA-001`;
    }
    return res.status(200).json({
      success: true,
      salesReturnId: salesReturn,
      message: "Generated new sales return ID",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllSalesReturn = async (req, res) => {
  try {
    const salesReturn = await SalesReturn.find();
    if (salesReturn.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No sales return found",
      });
    }
    return res.status(200).json({
      success: true,
      data: salesReturn,
      message: "Sales return data fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteSalesReturnBySalesReturnId = async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete the sales return
    const foundSalesreturn = await SalesReturn.findOneAndDelete({
      salesReturnId: id,
    });

    if (!foundSalesreturn) {
      return res.status(404).json({
        success: false,
        message: "Sales return not found",
      });
    }

    // Ensure itemDetails exists and is an array
    if (
      !foundSalesreturn.itemDetails ||
      !Array.isArray(foundSalesreturn.itemDetails) ||
      foundSalesreturn.itemDetails.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Sales return does not contain valid item details",
      });
    }

    // Extract SKUs and returned quantities from itemDetails
    for (const item of foundSalesreturn.itemDetails) {
      if (!item.sku) {
        continue; // Skip items without SKU
      }

      const inventoryItem = await Inventory.findOne({ sku: item.sku });

      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: `Inventory item with SKU ${item.sku} not found`,
        });
      }

      // Convert inventory quantity to a number
      const currentQuantity = Number(inventoryItem.quantity) || 0;
      const quantityToDelete = Number(item.returned) || 0;

      // Ensure the quantity doesn't go negative
      inventoryItem.quantity = Math.max(currentQuantity - quantityToDelete, 0);
      await inventoryItem.save();
    }

    return res.status(200).json({
      success: true,
      message: "Sales return deleted and inventory updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSalesReturnBySalesOrderId = async(req, res) => {
  try {
    const {salesOrderId} = req.params;
    const salesReturn = await SalesReturn.findOne({salesOrderId});
    if(!salesReturn) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Sales return does not exist"
      })
    }
    return res.status(200).json({
      success: true,
      data: salesReturn,
      message: "Sales return data fetched"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.createSalesReturn = createSalesReturn;
exports.generateSaleReturnNumber = generateSaleReturnNumber;
exports.getAllSalesReturn = getAllSalesReturn;
exports.deleteSalesReturnBySalesReturnId = deleteSalesReturnBySalesReturnId;
exports.getSalesReturnBySalesOrderId = getSalesReturnBySalesOrderId;