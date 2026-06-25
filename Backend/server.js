require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database.js")


// 1. Connect to your database
connectToDB()

// 3. Start your network port listener
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})