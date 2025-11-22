const express = require("express")
const Product = require("../models/Product")
const { isAuthenticated, isAuthorized } = require("../middleware/auth")

const router = express.Router()

// Get all products
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const { category, warehouse } = req.query
    const query = {}

    if (category) query.category = category

    const products = await Product.find(query).populate("locationStocks.warehouse")
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single product
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("locationStocks.warehouse")
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create product
router.post("/", isAuthenticated, isAuthorized(["Admin", "Manager"]), async (req, res) => {
  try {
    const { name, sku, category, unitOfMeasure, reorderLevel, reorderQuantity, supplier } = req.body

    const existingSKU = await Product.findOne({ sku })
    if (existingSKU) {
      return res.status(400).json({ error: "SKU already exists" })
    }

    const product = new Product({
      name,
      sku,
      category,
      unitOfMeasure,
      reorderLevel,
      reorderQuantity,
      supplier,
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update product
router.put("/:id", isAuthenticated, isAuthorized(["Admin", "Manager"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete product
router.delete("/:id", isAuthenticated, isAuthorized(["Admin"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
