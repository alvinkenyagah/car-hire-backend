const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// ✅ IMPORTANT: Explicitly configure cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

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
