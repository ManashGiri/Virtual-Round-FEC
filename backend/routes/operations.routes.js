const express = require("express")
const Receipt = require("../models/Receipt")
const DeliveryOrder = require("../models/DeliveryOrder")
const InternalTransfer = require("../models/InternalTransfer")
const StockAdjustment = require("../models/StockAdjustment")
const Product = require("../models/Product")
const MoveHistory = require("../models/MoveHistory")
const { isAuthenticated, isAuthorized } = require("../middleware/auth")
const { generateReceiptNo, generateOrderNo, generateTransferNo, generateAdjustmentNo } = require("../utils/generateIds")

const router = express.Router()

// RECEIPT OPERATIONS
router.post("/receipts", isAuthenticated, isAuthorized(["Manager", "Admin"]), async (req, res) => {
  try {
    const { supplier, warehouse, items, notes } = req.body

    const receipt = new Receipt({
      receiptNo: generateReceiptNo(),
      supplier,
      warehouse,
      items,
      notes,
    })

    await receipt.save()
    req.app.get("io").emit("receipt-created", receipt)
    res.status(201).json(receipt)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get receipts with filters
router.get("/receipts", isAuthenticated, async (req, res) => {
  try {
    const { warehouse, status, skip = 0, limit = 20 } = req.query
    const query = {}

    if (warehouse) query.warehouse = warehouse
    if (status) query.status = status

    const receipts = await Receipt.find(query)
      .populate("items.product")
      .populate("warehouse")
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(skip))
      .limit(Number.parseInt(limit))

    res.json(receipts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Accept receipt
router.put("/receipts/:id/accept", isAuthenticated, isAuthorized(["Manager", "Staff"]), async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate("items.product")

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" })
    }

    receipt.status = "Done"
    receipt.receivedBy = req.user._id
    receipt.receivedDate = new Date()

    // Update stock quantities
    for (const item of receipt.items) {
      const product = await Product.findById(item.product._id)

      let locationStock = product.locationStocks.find((ls) => ls.warehouse.toString() === receipt.warehouse.toString())

      if (!locationStock) {
        locationStock = { warehouse: receipt.warehouse, quantity: 0, location: "Default" }
        product.locationStocks.push(locationStock)
      }

      const previousQuantity = locationStock.quantity
      locationStock.quantity += item.quantityAccepted || item.quantityReceived

      await product.save()

      // Log movement
      await MoveHistory.create({
        transactionType: "Receipt",
        transactionId: receipt._id,
        product: item.product._id,
        warehouse: receipt.warehouse,
        quantityChange: item.quantityAccepted || item.quantityReceived,
        newQuantity: locationStock.quantity,
        user: req.user._id,
        notes: `Received from ${receipt.supplier}`,
      })
    }

    await receipt.save()
    req.app.get("io").emit("receipt-updated", receipt)
    res.json(receipt)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELIVERY ORDER OPERATIONS
router.post("/deliveries", isAuthenticated, isAuthorized(["Manager", "Admin"]), async (req, res) => {
  try {
    const { customer, warehouse, items, notes } = req.body

    const delivery = new DeliveryOrder({
      orderNo: generateOrderNo(),
      customer,
      warehouse,
      items,
      notes,
    })

    await delivery.save()
    req.app.get("io").emit("delivery-created", delivery)
    res.status(201).json(delivery)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get deliveries with filters
router.get("/deliveries", isAuthenticated, async (req, res) => {
  try {
    const { warehouse, status, skip = 0, limit = 20 } = req.query
    const query = {}

    if (warehouse) query.warehouse = warehouse
    if (status) query.status = status

    const deliveries = await DeliveryOrder.find(query)
      .populate("items.product")
      .populate("warehouse")
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(skip))
      .limit(Number.parseInt(limit))

    res.json(deliveries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ship delivery
router.put("/deliveries/:id/ship", isAuthenticated, isAuthorized(["Manager", "Staff"]), async (req, res) => {
  try {
    const delivery = await DeliveryOrder.findById(req.params.id).populate("items.product")

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" })
    }

    delivery.status = "Done"
    delivery.shippedBy = req.user._id
    delivery.shippedDate = new Date()

    // Update stock quantities
    for (const item of delivery.items) {
      const product = await Product.findById(item.product._id)

      const locationStock = product.locationStocks.find(
        (ls) => ls.warehouse.toString() === delivery.warehouse.toString(),
      )

      if (locationStock) {
        const previousQuantity = locationStock.quantity
        locationStock.quantity -= item.quantityShipped || item.quantityOrdered

        await product.save()

        // Log movement
        await MoveHistory.create({
          transactionType: "Delivery",
          transactionId: delivery._id,
          product: item.product._id,
          warehouse: delivery.warehouse,
          quantityChange: -(item.quantityShipped || item.quantityOrdered),
          newQuantity: locationStock.quantity,
          user: req.user._id,
          notes: `Shipped to ${delivery.customer}`,
        })
      }
    }

    await delivery.save()
    req.app.get("io").emit("delivery-updated", delivery)
    res.json(delivery)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// INTERNAL TRANSFER OPERATIONS
router.post("/transfers", isAuthenticated, isAuthorized(["Manager", "Admin"]), async (req, res) => {
  try {
    const { fromWarehouse, toWarehouse, items, notes } = req.body

    const transfer = new InternalTransfer({
      transferNo: generateTransferNo(),
      fromWarehouse,
      toWarehouse,
      items,
      notes,
    })

    await transfer.save()
    req.app.get("io").emit("transfer-created", transfer)
    res.status(201).json(transfer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get transfers
router.get("/transfers", isAuthenticated, async (req, res) => {
  try {
    const { warehouse, status, skip = 0, limit = 20 } = req.query
    const query = {}

    if (warehouse) {
      query.$or = [{ fromWarehouse: warehouse }, { toWarehouse: warehouse }]
    }
    if (status) query.status = status

    const transfers = await InternalTransfer.find(query)
      .populate("items.product")
      .populate("fromWarehouse")
      .populate("toWarehouse")
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(skip))
      .limit(Number.parseInt(limit))

    res.json(transfers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Receive transfer
router.put("/transfers/:id/receive", isAuthenticated, isAuthorized(["Manager", "Staff"]), async (req, res) => {
  try {
    const transfer = await InternalTransfer.findById(req.params.id).populate("items.product")

    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" })
    }

    transfer.status = "Done"
    transfer.receivedBy = req.user._id
    transfer.receivedDate = new Date()

    // Update stock in both warehouses
    for (const item of transfer.items) {
      const product = await Product.findById(item.product._id)

      // Decrease from source
      const sourceStock = product.locationStocks.find(
        (ls) => ls.warehouse.toString() === transfer.fromWarehouse.toString(),
      )
      if (sourceStock) {
        sourceStock.quantity -= item.quantityTransferred
      }

      // Increase at destination
      let destStock = product.locationStocks.find((ls) => ls.warehouse.toString() === transfer.toWarehouse.toString())
      if (!destStock) {
        destStock = { warehouse: transfer.toWarehouse, quantity: 0, location: "Default" }
        product.locationStocks.push(destStock)
      }
      destStock.quantity += item.quantityTransferred

      await product.save()

      // Log movements
      await MoveHistory.create({
        transactionType: "Transfer",
        transactionId: transfer._id,
        product: item.product._id,
        warehouse: transfer.fromWarehouse,
        quantityChange: -item.quantityTransferred,
        newQuantity: sourceStock.quantity,
        user: req.user._id,
        notes: `Transferred to another warehouse`,
      })

      await MoveHistory.create({
        transactionType: "Transfer",
        transactionId: transfer._id,
        product: item.product._id,
        warehouse: transfer.toWarehouse,
        quantityChange: item.quantityTransferred,
        newQuantity: destStock.quantity,
        user: req.user._id,
        notes: `Received from transfer`,
      })
    }

    await transfer.save()
    req.app.get("io").emit("transfer-updated", transfer)
    res.json(transfer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// STOCK ADJUSTMENT OPERATIONS
router.post("/adjustments", isAuthenticated, isAuthorized(["Manager", "Admin"]), async (req, res) => {
  try {
    const { warehouse, product, countedQuantity, reason, notes } = req.body

    const prod = await Product.findById(product)
    let recordedQuantity = 0

    const locationStock = prod.locationStocks.find((ls) => ls.warehouse.toString() === warehouse)

    if (locationStock) {
      recordedQuantity = locationStock.quantity
    }

    const adjustment = new StockAdjustment({
      adjustmentNo: generateAdjustmentNo(),
      warehouse,
      product,
      recordedQuantity,
      countedQuantity,
      adjustmentQuantity: countedQuantity - recordedQuantity,
      reason,
      notes,
      adjustedBy: req.user._id,
    })

    await adjustment.save()

    // Update product stock
    if (locationStock) {
      locationStock.quantity = countedQuantity
      await prod.save()

      // Log movement
      await MoveHistory.create({
        transactionType: "Adjustment",
        transactionId: adjustment._id,
        product,
        warehouse,
        quantityChange: countedQuantity - recordedQuantity,
        newQuantity: countedQuantity,
        user: req.user._id,
        notes: `Adjustment: ${reason}`,
      })
    }

    req.app.get("io").emit("adjustment-created", adjustment)
    res.status(201).json(adjustment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get adjustments
router.get("/adjustments", isAuthenticated, async (req, res) => {
  try {
    const { warehouse, skip = 0, limit = 20 } = req.query
    const query = {}

    if (warehouse) query.warehouse = warehouse

    const adjustments = await StockAdjustment.find(query)
      .populate("product")
      .populate("warehouse")
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(skip))
      .limit(Number.parseInt(limit))

    res.json(adjustments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get move history
router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const { warehouse, product, skip = 0, limit = 50 } = req.query
    const query = {}

    if (warehouse) query.warehouse = warehouse
    if (product) query.product = product

    const history = await MoveHistory.find(query)
      .populate("product")
      .populate("warehouse")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(skip))
      .limit(Number.parseInt(limit))

    res.json(history)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
