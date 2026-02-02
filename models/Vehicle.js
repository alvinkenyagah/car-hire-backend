const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  engine: { type: String, required: true },

  images: { type: String, required: true },


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
  },

  // New Fields
  features: {
    type: [String],
    default: [] // empty array by default
  },

  type: {
    type: String,
    enum: ["electric", "petrol", "diesel", "hybrid"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
