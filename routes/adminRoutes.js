const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/rbac");
const upload = require("../middleware/upload"); // ✅ Import upload

// ✅ Add upload middleware to handle images
router.post(
  "/vehicles", 
  protect, 
  adminOnly, 
  upload.array("images", 5), // ✅ This parses the multipart form data
  adminController.addVehicle
);

router.put(
  "/vehicles/:id", 
  protect, 
  adminOnly,
  upload.array("images", 5), // ✅ Also add for updates
  adminController.updateVehicle
);

router.delete("/vehicles/:id", protect, adminOnly, adminController.deleteVehicle);

// User management
router.put("/users/:id/approve", protect, adminOnly, adminController.approveUser);
router.put("/users/:id/suspend", protect, adminOnly, adminController.suspendUser);

// Hire management
router.put("/hire/:id/approve", protect, adminOnly, adminController.approveHire);
router.put("/hire/:id/score", protect, adminOnly, adminController.scoreVehicle);
router.put("/hire/:id/reject", protect, adminOnly, adminController.rejectHire);

router.post(
  "/vehicles/:id/images",
  protect,
  adminOnly,
  upload.array("images", 5),
  adminController.uploadVehicleImages
);

module.exports = router;