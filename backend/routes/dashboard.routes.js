const express = require("express")
const Product = require("../models/Product")
const Receipt = require("../models/Receipt")
const DeliveryOrder = require("../models/DeliveryOrder")
const InternalTransfer = require("../models/InternalTransfer")
const { isAuthenticated } = require("../middleware/auth")

const router = express.Router()

router.get("/kpis", isAuthenticated, async (req, res) => {
  try {
    const { warehouse } = req.query
    let warehouseFilter = {}

    if (warehouse) {
      warehouseFilter = { warehouse }
    }

    // Total products in stock
    const products = await Product.find()
    let totalProducts = 0
    let lowStockItems = 0
    let outOfStockItems = 0

    products.forEach((product) => {
      product.locationStocks.forEach((stock) => {
        if (!warehouse || stock.warehouse.toString() === warehouse) {
          totalProducts += stock.quantity
          if (stock.quantity === 0) outOfStockItems++
          else if (stock.quantity <= product.reorderLevel) lowStockItems++
        }
      })
    })

    // Pending operations
    const pendingReceipts = await Receipt.countDocuments({ status: { $in: ["Draft", "Waiting"] }, ...warehouseFilter })
    const pendingDeliveries = await DeliveryOrder.countDocuments({
      status: { $in: ["Draft", "Waiting"] },
      ...warehouseFilter,
    })
    const pendingTransfers = await InternalTransfer.countDocuments({
      $or: [{ fromWarehouse: warehouse }, { toWarehouse: warehouse }],
      status: { $in: ["Draft", "Waiting"] },
    })

    res.json({
      totalProducts,
      lowStockItems,
      outOfStockItems,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
