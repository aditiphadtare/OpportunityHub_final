const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
}));
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/opportunities", require("./routes/opportunities"));
app.use("/resume", require("./routes/resume"));
app.use("/deadlines", require("./routes/deadlines"));
app.use("/profile", require("./routes/profile"));

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "OpportunityHub Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

module.exports = app;
