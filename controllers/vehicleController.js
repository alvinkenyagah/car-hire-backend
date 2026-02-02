const Vehicle = require("../models/Vehicle");

// ========================
// User: Get available vehicles
// ========================
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "available" });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// Admin: Get all vehicles
// ========================
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ========================
// Get single vehicle by ID
// ========================
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json(vehicle);
  } catch (err) {
    console.error("Get vehicle error:", err);
    res.status(500).json({ message: err.message });
  }
};




// ========================
// Admin: Create new vehicle
// ========================
exports.createVehicle = async (req, res) => {
  try {
    console.log("\n========== CREATE VEHICLE DEBUG ==========");
    console.log("📝 req.body:", req.body);
    console.log("📸 req.files:", req.files);
    
    const {
      name,
      brand,
      engine,
      type,
      ratePerDay,
      features
    } = req.body;

    // ✅ Validate required fields
    if (!name || !brand || !engine || !type || !ratePerDay) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // ✅ CRITICAL FIX: Extract Cloudinary URLs correctly
    // When using CloudinaryStorage, the uploaded file info is in req.files
    // Each file object has: path, filename, fieldname, originalname, etc.
    const images = req.files && req.files.length > 0 
      ? req.files.map(file => {
          console.log("📸 Processing file:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            path: file.path,  // This is the Cloudinary URL
            filename: file.filename
          });
          return file.path;  // ✅ file.path contains the Cloudinary URL
        })
      : [];

    console.log("🖼️ Extracted image URLs:", images);
    console.log("🖼️ Total images:", images.length);

    // Parse features
    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' 
          ? JSON.parse(features) 
          : features;
      } catch (e) {
        console.log("⚠️ Features parsing error:", e.message);
        parsedFeatures = [];
      }
    }

    const vehicleData = {
      name,
      brand,
      engine,
      type,
      ratePerDay: Number(ratePerDay),
      features: parsedFeatures,
      images: images  // ✅ Save the Cloudinary URLs
    };

    console.log("💾 Creating vehicle with data:", vehicleData);

    const vehicle = await Vehicle.create(vehicleData);

    console.log("✅ Vehicle created!");
    console.log("✅ Vehicle ID:", vehicle._id);
    console.log("✅ Saved images:", vehicle.images);
    console.log("==========================================\n");

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle
    });
  } catch (error) {
    console.error("❌ Create vehicle error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Admin: Update vehicle
// ========================
exports.updateVehicle = async (req, res) => {
  try {
    console.log("\n========== UPDATE VEHICLE DEBUG ==========");
    console.log("📝 req.body:", req.body);
    console.log("📸 req.files:", req.files);
    
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const { name, brand, engine, ratePerDay, type, features, status } = req.body;

    // Update fields if provided
    if (name) vehicle.name = name;
    if (brand) vehicle.brand = brand;
    if (engine) vehicle.engine = engine;
    if (ratePerDay) vehicle.ratePerDay = Number(ratePerDay);
    if (type) vehicle.type = type;
    if (status) vehicle.status = status;
    
    if (features) {
      try {
        vehicle.features = typeof features === 'string' 
          ? JSON.parse(features) 
          : features;
      } catch (e) {
        console.log("⚠️ Features parsing error:", e.message);
      }
    }

    // ✅ Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => {
        console.log("📸 New image uploaded:", file.path);
        return file.path;
      });
      
      console.log("🖼️ Adding images:", newImages);
      vehicle.images.push(...newImages);
      console.log("🖼️ Total images now:", vehicle.images.length);
    }

    await vehicle.save();
    
    console.log("✅ Vehicle updated!");
    console.log("✅ Current images:", vehicle.images);
    console.log("==========================================\n");
    
    res.json(vehicle);
  } catch (err) {
    console.error("❌ Update vehicle error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ========================
// Admin: Delete vehicle
// ========================
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Use deleteOne() instead of remove() (deprecated in newer Mongoose versions)
    await vehicle.deleteOne();
    
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("❌ Delete vehicle error:", err);
    res.status(500).json({ message: err.message });
  }
};