const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

console.log("\n========================================");
console.log("🔧 Initializing Multer Upload Middleware");
console.log("========================================");
console.log("Cloudinary Cloud Name:", cloudinary.config().cloud_name);
console.log("Cloudinary API Key:", cloudinary.config().api_key ? "✅ Set" : "❌ Missing");
console.log("Cloudinary API Secret:", cloudinary.config().api_secret ? "✅ Set" : "❌ Missing");
console.log("========================================\n");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("\n🔄 CloudinaryStorage.params called");
    console.log("  📎 File:", file.originalname);
    console.log("  📎 Mimetype:", file.mimetype);
    console.log("  🌐 URL:", req.originalUrl);
    
    let folder = "misc";
    
    if (req.originalUrl.includes("vehicles")) {
      folder = "vehicles";
    } else if (req.originalUrl.includes("users")) {
      folder = "users";
    }
    
    console.log("  📁 Target folder:", folder);
    
    const params = {
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"]
    };
    
    console.log("  ⚙️  Upload params:", params);
    
    return params;
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("\n🔍 Multer fileFilter:");
    console.log("  📎 File:", file.originalname);
    console.log("  📎 Mimetype:", file.mimetype);
    console.log("  📎 Field name:", file.fieldname);
    
    // Check if it's an image
    if (file.mimetype.startsWith('image/')) {
      console.log("  ✅ File accepted");
      cb(null, true);
    } else {
      console.log("  ❌ File rejected - not an image");
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

console.log("✅ Multer upload middleware configured\n");

module.exports = upload;