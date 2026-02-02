/**
 * ===============================
 *  Cloudinary Connection Test v2
 *  (Works with network restrictions)
 * ===============================
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("\n========================================");
console.log("🔍 CLOUDINARY CONNECTION TEST v2");
console.log("========================================\n");

console.log("📋 Configuration:");
console.log("   Cloud Name:", cloudinary.config().cloud_name || "❌ MISSING");
console.log("   API Key:", cloudinary.config().api_key || "❌ MISSING");
console.log("   API Secret:", cloudinary.config().api_secret ? "✅ Set" : "❌ MISSING");
console.log();

if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
  console.log("❌ ERROR: Missing Cloudinary credentials!");
  process.exit(1);
}

// Create a simple test image file (1x1 red pixel PNG)
function createTestImage() {
  const testImagePath = path.join(__dirname, "test-image.png");
  
  // This is a base64-encoded 1x1 red pixel PNG
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
  
  fs.writeFileSync(testImagePath, Buffer.from(base64Image, 'base64'));
  
  return testImagePath;
}

async function testCloudinaryUpload() {
  let testImagePath;
  
  try {
    console.log("🖼️  Creating test image...");
    testImagePath = createTestImage();
    console.log("✅ Test image created:", testImagePath);
    console.log();
    
    console.log("🔄 Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(testImagePath, { 
      folder: "test-uploads",
      public_id: `test_${Date.now()}`,
      resource_type: "image"
    });
    
    console.log("\n✅ UPLOAD SUCCESSFUL!");
    console.log("   Public ID:", result.public_id);
    console.log("   Format:", result.format);
    console.log("   Secure URL:", result.secure_url);
    console.log();
    
    // Test deletion
    console.log("🗑️  Cleaning up...");
    await cloudinary.uploader.destroy(result.public_id);
    console.log("✅ Test image deleted from Cloudinary");
    
    // Delete local test file
    fs.unlinkSync(testImagePath);
    console.log("✅ Local test file removed");
    
    console.log("\n========================================");
    console.log("✅ ALL TESTS PASSED!");
    console.log("========================================");
    console.log("\n💡 Cloudinary is working correctly!");
    console.log("   The issue must be in your multer/upload middleware.\n");
    
  } catch (error) {
    console.log("\n❌ UPLOAD FAILED!");
    console.log("   Error:", error.message);
    console.log("\n💡 Error details:");
    console.error(error);
    console.log("\n========================================\n");
    
    // Cleanup
    if (testImagePath && fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    process.exit(1);
  }
}

testCloudinaryUpload();