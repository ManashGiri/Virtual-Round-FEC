const mongoose = require("mongoose")

const moveHistorySchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ["Receipt", "Delivery", "Transfer", "Adjustment"],
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "transactionType",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  quantityChange: Number,
  newQuantity: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

moveHistorySchema.index({ warehouse: 1, product: 1, createdAt: -1 })

module.exports = mongoose.model("MoveHistory", moveHistorySchema)
