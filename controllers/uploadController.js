const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

exports.uploadUserDocuments = async (req, res) => {
  const updates = {};

  if (req.files.portrait)
    updates.portraitPhoto = req.files.portrait[0].path;

  if (req.files.idDocument)
    updates.idDocument = req.files.idDocument[0].path;

  if (req.files.drivingLicense)
    updates.drivingLicense = req.files.drivingLicense[0].path;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true }
  );

  res.json({
    message: "Documents uploaded successfully",
    user
  });
};
