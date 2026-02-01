const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Generic Cloudinary storage for any type of upload
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "car-hire"; // default folder

    // Custom folder logic based on fieldname
    switch (file.fieldname) {
      case "portrait":
        folder = "users/portrait";
        break;
      case "idDocument":
        folder = "users/id";
        break;
      case "drivingLicense":
        folder = "users/dl";
        break;
      case "images":
        folder = "vehicles";
        break;
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      public_id: `${file.fieldname}-${Date.now()}`
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
