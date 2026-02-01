const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Hire = require("../models/Hire");

exports.addVehicle = async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(vehicle);
};

exports.updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(vehicle);
};

exports.deleteVehicle = async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ message: "Vehicle removed" });
};

exports.approveUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isVerified: true });
  res.json({ message: "User approved" });
};

exports.suspendUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isSuspended: true });
  res.json({ message: "User suspended" });
};

exports.approveHire = async (req, res) => {
  const hire = await Hire.findById(req.params.id).populate("vehicle");

  hire.status = "approved";
  await hire.save();

  await Vehicle.findByIdAndUpdate(hire.vehicle._id, {
    status: "hired"
  });

  res.json({ message: "Hire approved" });
};

exports.scoreVehicle = async (req, res) => {
  const { score } = req.body;
  const hire = await Hire.findById(req.params.id).populate("vehicle");

  hire.status = "completed";
  hire.returnedAt = new Date();
  await hire.save();

  await Vehicle.findByIdAndUpdate(hire.vehicle._id, {
    conditionScore: score,
    status: "available"
  });

  res.json({ message: "Vehicle scored & returned" });
};


exports.approveHire = async (req, res) => {
  const hire = await Hire.findById(req.params.id)
    .populate("vehicle");

  if (!hire) {
    return res.status(404).json({ message: "Hire not found" });
  }

  if (hire.status !== "pending") {
    return res.status(400).json({
      message: "Hire is not pending"
    });
  }

  if (hire.vehicle.status !== "available") {
    return res.status(400).json({
      message: "Vehicle already booked"
    });
  }

  hire.status = "approved";
  await hire.save();

  hire.vehicle.status = "hired";
  await hire.vehicle.save();

  res.json({ message: "Hire approved successfully" });
};



exports.rejectHire = async (req, res) => {
  const hire = await Hire.findById(req.params.id);

  if (!hire || hire.status !== "pending") {
    return res.status(400).json({ message: "Invalid hire request" });
  }

  hire.status = "rejected";
  await hire.save();

  res.json({ message: "Hire rejected" });
};


exports.uploadVehicleImages = async (req, res) => {
  const images = req.files.map(file => file.path);

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: images } } },
    { new: true }
  );

  res.json(vehicle);
};
