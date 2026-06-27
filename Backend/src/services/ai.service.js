const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

// ✅ Fallback chain to support both naming styles across local and production configurations
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY
});

const interviewReportResponseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.INTEGER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, description: "The severity of this skill gap: low, medium, or high" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day" },
                    tasks: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "List of tasks to be done on this day" 
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: { type: Type.STRING, description: "The title of the job for which the interview report is generated" }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        
                        CRITICAL: Return exact structured JSON conforming precisely to the requested schema layout.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportResponseSchema,
            }
        });

        const responseText = response.text || response.candidates[0].content.parts[0].text;
        return JSON.parse(responseText);
    } catch (error) {
        console.error("❌ Error generating interview report inside AI service:", error);
        throw error;
    }
}

// 🔐 UPDATED: Light-weight structural asset pipeline that bypasses OS Chrome compilation requirements entirely
async function generatePdfFromHtml(htmlContent) {
    try {
        // dynamic module loading to prevent system lock variations
        const pdf = require('html-pdf-node');
        
        let options = { 
            format: 'A4',
            margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
        };
        let file = { content: htmlContent };
        
        // This generates full PDF binary structures purely via runtime engine without launching local browsers!
        const pdfBuffer = await pdf.generatePdf(file, options);
        return pdfBuffer;
    } catch (e) {
        console.log("Fallback implementation triggered due to module constraints.");
        // Secondary ultra-safeguard variant using standard puppeteer with generic fallback flags
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null, // natively uses render native environment variable flags if mapped
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        return pdfBuffer;
    }
}






async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        const resumePdfSchema = {
            type: Type.OBJECT,
            properties: {
                html: { type: Type.STRING, description: "The complete HTML string of the structured resume" }
            },
            required: ["html"]
        };

        const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema,
            }
        });

        const responseText = response.text || response.candidates[0].content.parts[0].text;
        const jsonContent = JSON.parse(responseText);
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

        return pdfBuffer;
    } catch (error) {
        console.error("❌ Error generating Resume PDF inside AI service:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };