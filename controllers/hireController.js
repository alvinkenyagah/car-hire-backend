const Hire = require("../models/Hire");
const Vehicle = require("../models/Vehicle");
const dayjs = require("dayjs");


exports.createHireRequest = async (req, res) => {
  try {
    const user = req.user;

    if (!user.verified)
      return res.status(403).json({ message: "Account not verified" });

    if (user.suspended)
      return res.status(403).json({ message: "Account suspended" });

    const { vehicleId, startDate, endDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    const days =
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * vehicle.ratePerDay;

    const hire = await Hire.create({
      user: user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice
    });

    res.status(201).json(hire);

  } catch (err) {
    res.status(500).json({ message: "Failed to create hire request" });
  }
};





exports.previewCost = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    const days =
      dayjs(endDate).diff(dayjs(startDate), "day") + 1;

    if (days <= 0)
      return res.status(400).json({ message: "Invalid date range" });

    const totalCost = days * vehicle.ratePerDay;

    res.json({
      days,
      ratePerDay: vehicle.ratePerDay,
      totalCost
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to preview cost" });
  }
};
