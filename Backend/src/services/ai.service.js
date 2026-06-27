const { GoogleGenAI, Type } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

// ✅ Fallback chain to support both naming styles across local and production configurations
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY
});

// We keep Zod for backend validation if you need it elsewhere, 
// but we define a direct SDK-compatible schema to ensure the API never misinterprets it.
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
                        
                        CRITICAL: Return exact structured JSON conforming precisely to the requested schema layout.`

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

async function generatePdfFromHtml(htmlContent) {
    // ✅ Render's environment handles its own dynamic binary mapping using PUPPETEER_PRODUCT variable configuration
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true, 
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
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