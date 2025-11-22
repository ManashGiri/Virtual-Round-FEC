const mongoose = require("mongoose")

const deliveryOrderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    unique: true,
    required: true,
  },
  customer: String,
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantityOrdered: {
        type: Number,
        required: true,
      },
      quantityPicked: {
        type: Number,
        default: 0,
      },
      quantityShipped: {
        type: Number,
        default: 0,
      },
    },
  ],
  status: {
    type: String,
    enum: ["Draft", "Waiting", "Ready", "Done", "Canceled"],
    default: "Draft",
  },
  pickedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shippedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shippedDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

deliveryOrderSchema.index({ warehouse: 1, status: 1 })

module.exports = mongoose.model("DeliveryOrder", deliveryOrderSchema)
