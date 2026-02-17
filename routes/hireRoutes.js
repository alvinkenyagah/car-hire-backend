const express = require("express");
const router = express.Router();
const hireController = require("../controllers/hireController");
const { protect } = require("../middleware/auth");

// Only logged-in users can request hire
router.post("/", protect, hireController.createHireRequest);

module.exports = router;
