require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const connectToDB = require("./src/config/database.js");
const path = require('path');

// 1. Connect to your database
connectToDB();

// 2. Serve static files from the Frontend dist directory
// Since server.js is inside Backend/, '__dirname' is 'your-project/Backend'.
// '../Frontend/dist' correctly steps up to root, then steps into Frontend/dist.
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// 3. Catch-all route to handle React Router client-side page loads
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
});

// 4. Start your network port listener
// Render provides a dynamic port using process.env.PORT, falling back to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});