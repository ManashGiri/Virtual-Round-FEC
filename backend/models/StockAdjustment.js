const mongoose = require("mongoose")

const stockAdjustmentSchema = new mongoose.Schema({
  adjustmentNo: {
    type: String,
    unique: true,
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  recordedQuantity: Number,
  countedQuantity: {
    type: Number,
    required: true,
  },
  adjustmentQuantity: Number,
  reason: {
    type: String,
    enum: ["Damage", "Theft", "Counting Error", "Expiry", "Other"],
    default: "Counting Error",
  },
  notes: String,
  adjustedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

stockAdjustmentSchema.index({ warehouse: 1, product: 1 })

module.exports = mongoose.model("StockAdjustment", stockAdjustmentSchema)
