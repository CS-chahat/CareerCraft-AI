
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model"); // Checked path

async function authUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        // Fixed variable name to match the top import statement
        const isTokenBlackListed = await blacklistTokenModel.findOne({ token });
        if (isTokenBlackListed) {
            return res.status(401).json({
                message: "Unauthorized: Token is blacklisted"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attaches { id, username, email } to req
        return next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({
            message: "Unauthorized: Token is Invalid or Expired"
        });
    }
}

module.exports = { authUser };