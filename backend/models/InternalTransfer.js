const mongoose = require("mongoose")

const internalTransferSchema = new mongoose.Schema({
  transferNo: {
    type: String,
    unique: true,
    required: true,
  },
  fromWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  toWarehouse: {
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
      quantityTransferred: {
        type: Number,
        required: true,
      },
      quantityReceived: {
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
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

internalTransferSchema.index({ fromWarehouse: 1, toWarehouse: 1, status: 1 })

module.exports = mongoose.model("InternalTransfer", internalTransferSchema)
