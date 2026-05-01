require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// API Routes
app.use("/api/patient", patientRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`=========================================`);
});
