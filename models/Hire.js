const mongoose = require("mongoose");

const hireSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },

  startDate: Date,
  endDate: Date,

  status: {
    type: String,
    enum: ["pending", "approved", "active", "completed", "rejected"],
    default: "pending"
  },

  totalCost: Number,
  returnedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("Hire", hireSchema);
