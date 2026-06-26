const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(cookieParser());
app.use(express.json());

// List your allowed origins here
const allowedOrigins = [
    "http://localhost:5173",
    "https://careercraft-ai-8v2u.onrender.com" // Your Render frontend URL
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

const interviewRouter = require("./routes/interview.routes");
const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;