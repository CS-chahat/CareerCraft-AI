const pdf = require("pdf-parse");
// Safely handles both default ES modules and standard commonJS bundles
const pdfParse = typeof pdf === 'function' ? pdf : pdf.default || require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        // 1. Guard check: Ensure a file was actually uploaded by the client
        if (!req.file) {
            return res.status(400).json({
                message: "No resume file uploaded. Please upload a valid PDF resume."
            })
        }

        const { selfDescription, jobDescription } = req.body
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Missing required fields: selfDescription or jobDescription."
            })
        }

        // 2. Fixed pdf-parse invocation syntax to handle buffer securely
        const parsedPdf = await pdfParse(req.file.buffer)
        const resumeText = parsedPdf.text

        // 3. Hand off data to AI service (using gemini-1.5-flash)
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        // 4. Save structured report to database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error)
        return res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message || "Internal Server Error"
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error)
        return res.status(500).json({
            message: "Internal server error while fetching report."
        })
    }
}

/** * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Error in getAllInterviewReportsController:", error)
        return res.status(500).json({
            message: "Internal server error while fetching reports list."
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        // Hand off content to Puppeteer/Gemini generator pipeline
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        return res.send(pdfBuffer)

    } catch (error) {
        console.error("Error in generateResumePdfController:", error)
        return res.status(500).json({
            message: "Failed to generate resume PDF payload."
        })
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
}