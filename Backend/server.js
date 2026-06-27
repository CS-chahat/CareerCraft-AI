require("dotenv").config();
const express = require("express");
const cors = require("cors"); // 1. CORS Package Import kiya
const app = require("./src/app");
const connectToDB = require("./src/config/database.js");
const path = require('path');

// Connect to your database
connectToDB();

// 2. CORS Policy Configure ki (Yeh frontend aur backend ka connection jodeyga)
app.use(cors({
    origin: "http://localhost:5173", // Aapke local frontend ka URL
    credentials: true // Cookies aur auth tokens pass karne ke liye
}));

// 3. Ek simple health-check/welcome route taaki page direct kholne par blank na dikhe
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "CareerCraft AI Backend is Live and Connected!" });
});

// Wrap Frontend static file distribution logic
// Only attempts to find and serve the frontend assets if we are working locally.
if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));

    // Catch-all route to handle React Router client-side page loads locally
    app.get(/.*/, (req, res) => {
        if (!req.path.startsWith('/interview') && !req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
        }
    });
}

// Start your network port listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});