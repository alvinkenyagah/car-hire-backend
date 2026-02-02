const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // ✅ Import from config

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "misc";
    
    if (req.originalUrl.includes("vehicles")) {
      folder = "vehicles";
    } else if (req.originalUrl.includes("users")) {
      folder = "users";
    }
    
    return {
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"]
    };
  }
});

const upload = multer({ storage });

module.exports = upload;