const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  unitOfMeasure: {
    type: String,
    enum: ["kg", "pcs", "l", "box", "bag", "carton", "units"],
    default: "pcs",
  },
  reorderLevel: {
    type: Number,
    default: 10,
  },
  reorderQuantity: {
    type: Number,
    default: 50,
  },
  description: String,
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  locationStocks: [
    {
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true,
      },
      location: String,
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for efficient queries
productSchema.index({ sku: 1 })
productSchema.index({ category: 1 })

module.exports = mongoose.model("Product", productSchema)
