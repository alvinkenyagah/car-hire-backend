const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/rbac");
const upload = require("../middleware/upload");

// ========================
// Public Routes
// ========================

// Get all available vehicles (no login required)
router.get("/vehicles", vehicleController.getAvailableVehicles);

// ========================
// User Routes
// ========================

// Get available vehicles (logged-in users)
router.get("/user/vehicles", protect, vehicleController.getAvailableVehicles);

// ========================
// Admin Routes
// ========================

// Get all vehicles (admin)
router.get("/admin/vehicles", protect, adminOnly, vehicleController.getAllVehicles);

// Add new vehicle
router.post(
  "/admin/vehicles",
  protect,
  adminOnly,
  upload.array("images", 5),
  vehicleController.createVehicle
);

// Update vehicle
router.put(
  "/admin/vehicles/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  vehicleController.updateVehicle
);

// Delete vehicle
router.delete(
  "/admin/vehicles/:id",
  protect,
  adminOnly,
  vehicleController.deleteVehicle
);

module.exports = router;
