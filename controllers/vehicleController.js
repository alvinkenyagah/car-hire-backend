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
// Admin: Create new vehicle
// ========================





exports.createVehicle = async (req, res) => {
  try {
    const {
      name,
      brand,
      engine,
      type,
      ratePerDay,
      features
    } = req.body;

    // ✅ Validate required fields early
    if (!name || !brand || !engine || !type || !ratePerDay) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // ✅ Extract uploaded images
    const images = req.files ? req.files.map(file => file.path) : [];

    const vehicle = await Vehicle.create({
      name,
      brand,
      engine,
      type,
      ratePerDay,
      features: features ? JSON.parse(features) : [],
      images
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle
    });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ message: error.message });
  }
};




















// ========================
// Admin: Update vehicle
// ========================
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const { name, brand, engine, ratePerDay, type, features, status } = req.body;

    if (name) vehicle.name = name;
    if (brand) vehicle.brand = brand;
    if (engine) vehicle.engine = engine;
    if (ratePerDay) vehicle.ratePerDay = ratePerDay;
    if (type) vehicle.type = type;
    if (features) vehicle.features = JSON.parse(features);
    if (status) vehicle.status = status;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      vehicle.images.push(...newImages);
    }

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// Admin: Delete vehicle
// ========================
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    await vehicle.remove();
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
