const Vehicle = require("../models/Vehicle");
const dayjs = require("dayjs");

exports.previewCost = async (req, res) => {
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
};
