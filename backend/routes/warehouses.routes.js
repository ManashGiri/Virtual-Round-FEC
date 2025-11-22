const express = require("express")
const Warehouse = require("../models/Warehouse")
const { isAuthenticated, isAuthorized } = require("../middleware/auth")

const router = express.Router()

// Get all warehouses
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ isActive: true }).populate("manager", "name")
    res.json(warehouses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create warehouse
router.post("/", isAuthenticated, isAuthorized(["Admin"]), async (req, res) => {
  try {
    const { name, location, manager, capacity } = req.body

    const warehouse = new Warehouse({
      name,
      location,
      manager,
      capacity,
    })

    await warehouse.save()
    res.status(201).json(warehouse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
