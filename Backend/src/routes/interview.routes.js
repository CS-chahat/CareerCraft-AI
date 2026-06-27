const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate new interview report based on user self-description, resume PDF, and job description.
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, (req, res, next) => {
    // Wrap multer explicitly to handle optional file uploads safely
    upload.single("resume")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ 
                success: false, 
                message: "File processing failed", 
                error: err.message 
            });
        }
        next();
    });
}, interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId.
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of the logged-in user.
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/resume/:interviewReportId
 * @description Generate resume PDF based on user data and evaluation report.
 * @access Private
 */
// 🔐 Securely restored the auth middleware now that the Render environment is ready
interviewRouter.get("/resume/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;