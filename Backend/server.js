require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./src/app");
const connectToDB = require("./src/config/database.js");
const path = require('path');

// Connect to your database
connectToDB();

// CORS dynamic configure kiya taaki local aur production dono safe rahein
app.use(cors({
    origin: ["http://localhost:5173", "https://careercraft-ai-8v2u.onrender.com"],
    credentials: true
}));

// 🚨 FIXED: Production condition hata di! Ab Render cloud par bhi aapka static frontend load hoga.
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// API health check (Optional, internally accessible)
app.get("/api-status", (req, res) => {
    res.status(200).json({ success: true, message: "API internal engine is running fine." });
});

// Catch-all route to handle React Router page loads everywhere (Local & Render)
app.get(/.*/, (req, res) => {
    // Kisi bhi internal backend route ko intercept hone se rokne ke liye
    if (!req.path.startsWith('/interview') && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
    }
});

// Start your network port listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});