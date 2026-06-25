require("dotenv").config()
const express = require("express")
const app = require("./src/app")
const connectToDB = require("./src/config/database.js")


// 1. Connect to your database
connectToDB()
const path = require('path');

// Serve static files from the Frontend dist directory
app.use(express.static(path.join(__dirname, '../Frontend/dist')));


// ✅ New syntax compatible with modern path-to-regexp matching
app.get('*path', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
});

// 3. Start your network port listener
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})