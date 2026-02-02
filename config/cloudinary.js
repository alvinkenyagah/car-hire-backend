const cloudinary = require("cloudinary").v2;
require("dotenv").config();


console.log("Cloudinary URL:", process.env.CLOUDINARY_URL);


cloudinary.config({ 
  secure: true,
  url: process.env.CLOUDINARY_URL
});

module.exports = cloudinary;
