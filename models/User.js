const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,

  password: { type: String, required: true },

  idNumber: {
    type: String,
    unique: true,
    sparse: true
  },

  portraitPhoto: String,
  idDocument: String,
  drivingLicense: String,

  isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
