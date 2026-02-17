const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const vehicleController = require("../controllers/vehicleController"); // ✅ Import vehicle controller
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/rbac");
const upload = require("../middleware/upload");

console.log("✅ Admin routes loaded");

// ============================================
// VEHICLE MANAGEMENT
// ✅ These routes handle file uploads properly
// ============================================
router.post(
  "/vehicles",
  protect,
  adminOnly,
  upload.array("images", 5),  // ✅ Parse multipart/form-data with images
  vehicleController.createVehicle  // ✅ Use vehicleController
);

router.put(
  "/vehicles/:id",
  protect,
  adminOnly,
  upload.array("images", 5),  // ✅ Handle images in updates too
  vehicleController.updateVehicle
);

router.delete(
  "/vehicles/:id",
  protect,
  adminOnly,
  vehicleController.deleteVehicle
);








// ============================================
// USER MANAGEMENT
// ============================================
router.put("/users/:id/approve", protect, adminOnly, adminController.approveUser);
router.put("/users/:id/suspend", protect, adminOnly, adminController.suspendUser);



// routes/adminRoutes.js
router.get("/users", protect, adminOnly, adminController.getAllUsers);
router.put("/users/:id/approve", protect, adminOnly, adminController.approveUser);
router.put("/users/:id/suspend", protect, adminOnly, adminController.suspendUser);



// ============================================
// HIRE MANAGEMENT
// ============================================
router.put("/hire/:id/approve", protect, adminOnly, adminController.approveHire);
router.put("/hire/:id/score", protect, adminOnly, adminController.scoreVehicle);
router.put("/hire/:id/reject", protect, adminOnly, adminController.rejectHire);

// ============================================
// ADDITIONAL IMAGE UPLOAD (for existing vehicles)
// ============================================
router.post(
  "/vehicles/:id/images",
  protect,
  adminOnly,
  upload.array("images", 5),
  adminController.uploadVehicleImages
);

module.exports = router;