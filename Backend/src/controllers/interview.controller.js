const pdf = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Highly resilient controller to generate interview reports with bulletproof fallbacks.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Missing required fields: selfDescription or jobDescription."
            })
        }

        // Make resume file structurally optional
        let resumeText = "";
        if (req.file) {
            try {
                // 🛡️ PERMANENT FIX: Bulletproof runtime check for pdf-parse exports
                const parseFunction = typeof pdf === 'function' ? pdf : (pdf.default || Object.values(pdf).find(f => typeof f === 'function'));
                
                if (!parseFunction) {
                    throw new Error("Could not locate valid parsing function from pdf-parse module.");
                }
                
                const parsedPdf = await parseFunction(req.file.buffer)
                resumeText = parsedPdf.text || "";
            } catch (pdfError) {
                console.error("PDF Parsing failed, falling back to description string:", pdfError.message);
                resumeText = "Valid PDF uploaded, but text parsing failed extracted contents.";
            }
        } else {
            resumeText = "No resume provided. Rely entirely on the user self-description profile.";
        }

        // Hand off data to AI service
        let interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        // Ensure we parse string responses if the service layer skipped it
        if (typeof interViewReportByAi === "string") {
            try {
                interViewReportByAi = JSON.parse(interViewReportByAi);
            } catch (e) {
                console.error("❌ AI response failed to parse as JSON string:", e);
                throw new Error("AI returned data in an unparsable string format.");
            }
        }

        // 🚨 CRITICAL VALIDATION: Ensure the AI actually returned data before creating DB entry
        if (!interViewReportByAi || (!interViewReportByAi.matchScore && interViewReportByAi.matchScore !== 0)) {
            throw new Error("AI Service returned an invalid or empty report payload.");
        }

        const fallbackTitle = jobDescription.split('\n')[0].replace(/[^\w\s-]/g, '').trim().substring(0, 50) || "Custom Interview Strategy";
        const extractedTitle = interViewReportByAi?.title || interViewReportByAi?.jobTitle || fallbackTitle;

        // Save normalized object structure to database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            title: extractedTitle,
            matchScore: interViewReportByAi.matchScore,
            technicalQuestions: interViewReportByAi.technicalQuestions || [],
            behavioralQuestions: interViewReportByAi.behavioralQuestions || [],
            skillGaps: interViewReportByAi.skillGaps || [],
            preparationPlan: interViewReportByAi.preparationPlan || []
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("❌ Error in generateInterViewReportController final execution branch:", error)
        return res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message || "Internal Server Error"
        })
    }
}

async function getInterviewReportByIdController(req, res) { 
    try { 
        const { interviewId } = req.params; 
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id }); 
        if (!interviewReport) return res.status(404).json({ message: "Interview report not found." }); 
        return res.status(200).json({ message: "Interview report fetched successfully.", interviewReport }); 
    } catch (error) { 
        return res.status(500).json({ message: "Internal server error" }); 
    } 
}

async function getAllInterviewReportsController(req, res) { 
    try { 
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"); 
        return res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports }); 
    } catch (error) { 
        return res.status(500).json({ message: "Internal server error" }); 
    } 
}

async function generateResumePdfController(req, res) { 
    try { 
        const { interviewReportId } = req.params; 
        const interviewReport = await interviewReportModel.findById(interviewReportId); 
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found in system storage." }); 
        }

        // Run binary creation service
        const pdfBuffer = await generateResumePdf({ 
            resume: interviewReport.resume, 
            jobDescription: interviewReport.jobDescription, 
            selfDescription: interviewReport.selfDescription 
        }); 

        res.set({ 
            "Content-Type": "application/pdf", 
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf` 
        }); 
        return res.send(pdfBuffer); 
    } catch (error) { 
        // ✅ FIX: Log out the exact error stack trace to your Render backend stream terminal
        console.error("❌ CRITICAL PDF COMPILER CRASH DETECTED:", error);
        
        // Return JSON with the exact failure message so our custom frontend hook can catch it
        return res.status(500).json({ 
            message: `Failed to compile PDF asset: ${error.message || "Unknown internal compiler crash"}` 
        }); 
    } 
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
}