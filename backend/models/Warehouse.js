const mongoose = require("mongoose")

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  capacity: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Warehouse", warehouseSchema)
