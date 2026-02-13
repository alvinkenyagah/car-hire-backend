const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Hire = require("../models/Hire");
const dayjs = require("dayjs");

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};

    // ✅ Only allow name and phone updates
    if (req.body.name) updates.name = req.body.name;
    if (req.body.phone) updates.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};




exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};



exports.getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ status: "available" });
  res.json(vehicles);
};

exports.hireVehicle = async (req, res) => {
  const { vehicleId, startDate, endDate } = req.body;

  const user = await User.findById(req.user.id);
  if (!user.idDocument || !user.drivingLicense)
    return res.status(400).json({ message: "Upload ID & DL first" });

  const vehicle = await Vehicle.findById(vehicleId);
  if (vehicle.status !== "available")
    return res.status(400).json({ message: "Vehicle unavailable" });

  const days =
    dayjs(endDate).diff(dayjs(startDate), "day") + 1;

  const totalCost = days * vehicle.ratePerDay;

  const hire = await Hire.create({
    user: user._id,
    vehicle: vehicle._id,
    startDate,
    endDate,
    totalCost
  });

  res.status(201).json(hire);
};

exports.myHires = async (req, res) => {
  const hires = await Hire.find({ user: req.user.id })
    .populate("vehicle");

  res.json(hires);
};
