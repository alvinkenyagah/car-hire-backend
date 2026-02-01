const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const vehicleRoutes = require("./routes/vehicleRoutes");


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());






app.use("/api", vehicleRoutes);




// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Car Hire API running 🚗");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
