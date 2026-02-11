const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      idNumber,
      portraitPhoto,
      idDocument,
      drivingLicense
    } = req.body;

 //basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Simple password strength check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

//check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

//check existing ID number if provided
    if (idNumber) {
      const existingID = await User.findOne({ idNumber });
      if (existingID) {
        return res.status(400).json({
          message: "ID number already registered"
        });
      }
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

//create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      idNumber,
      portraitPhoto,
      idDocument,
      drivingLicense,
      role: "user",        // default role
      isVerified: false,   // admin must approve
      isSuspended: false
    });
//return response
    res.status(201).json({
      success: true,
      message: "Account created successfully. Pending admin approval.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Server error during registration"
    });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (user.isSuspended)
    return res.status(403).json({ message: "Account suspended" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    }
  });
};
