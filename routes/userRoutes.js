const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { userOnly } = require("../middleware/rbac");

router.put("/profile", protect, userOnly, userController.updateProfile);
router.get("/vehicles", protect, userOnly, userController.getVehicles);
router.post("/hire", protect, userOnly, userController.hireVehicle);
router.get("/hire", protect, userOnly, userController.myHires);


const hireController = require("../controllers/hireController");

router.post(
  "/hire/preview",
  protect,
  userOnly,
  hireController.previewCost
);



const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

router.post(
  "/upload-documents",
  protect,
  userOnly,
  upload.fields([
    { name: "portrait", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 }
  ]),
  uploadController.uploadUserDocuments
);





module.exports = router;
