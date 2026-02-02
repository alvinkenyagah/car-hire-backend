const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/rbac");
const upload = require("../middleware/upload");

// ========================
// Public Routes
// ========================

// Anyone can view available vehicles without logging in
router.get("/vehicles", vehicleController.getAvailableVehicles);

// ========================
// User Routes (protected)
// ========================

// Logged-in users can view available vehicles
router.get("/user/vehicles", protect, vehicleController.getAvailableVehicles);

// ========================
// Admin Routes (protected + RBAC)
// ========================

// Admin: Get all vehicles
router.get("/admin/vehicles", protect, adminOnly, vehicleController.getAllVehicles);

// Admin & User: Get single vehicle by ID
router.get("/vehicles/:id", vehicleController.getVehicleById)

// Admin: Add a new vehicle
router.post(
  "/admin/vehicles",
  protect,
  adminOnly,
  upload.array("images", 5), // Multer for up to 5 images
  vehicleController.createVehicle
);

// Admin: Update vehicle
router.put(
  "/admin/vehicles/:id",
  protect,
  adminOnly,
  upload.array("images", 5), // Optional new images
  vehicleController.updateVehicle
);

// Admin: Delete vehicle
router.delete(
  "/admin/vehicles/:id",
  protect,
  adminOnly,
  vehicleController.deleteVehicle
);

module.exports = router;
