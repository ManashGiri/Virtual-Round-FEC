const mongoose = require("mongoose")

const receiptSchema = new mongoose.Schema({
  receiptNo: {
    type: String,
    unique: true,
    required: true,
  },
  supplier: String,
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
      quantityReceived: {
        type: Number,
        required: true,
      },
      quantityAccepted: {
        type: Number,
        default: 0,
      },
      quantityRejected: {
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
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receivedDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

receiptSchema.index({ warehouse: 1, status: 1 })

module.exports = mongoose.model("Receipt", receiptSchema)
