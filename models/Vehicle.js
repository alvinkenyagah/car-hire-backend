const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  brand: String,
  engine: String,

  images: [String],

  ratePerDay: { type: Number, required: true },

  status: {
    type: String,
    enum: ["available", "hired", "maintenance"],
    default: "available"
  },

  conditionScore: {
    type: Number,
    min: 1,
    max: 10
  }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
