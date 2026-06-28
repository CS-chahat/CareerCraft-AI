const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY
});

// [Schema structures kept identical to maintain full system integrity...]
const interviewReportResponseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.INTEGER },
        technicalQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    severity: { type: Type.STRING }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER },
                    focus: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: { type: Type.STRING }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        // Safe check: If parsing failed, rely heavily on selfDescription text
        const safeResume = resume && !resume.includes("failed") ? resume : "Not available (Use Self Description)";
        
        const prompt = `Generate an interview report for a candidate with the following details:
                        Resume Text: ${safeResume}
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

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        const resumePdfSchema = {
            type: Type.OBJECT,
            properties: {
                html: { type: Type.STRING, description: "The complete HTML string of the structured resume" }
            },
            required: ["html"]
        };

        const safeResume = resume && !resume.includes("failed") ? resume : "Not available (Use Self Description)";

        const prompt = `Generate a professionally tailored resume based on these details:
                        Candidate Resume/Context: ${safeResume}
                        Self Description: ${selfDescription}
                        Target Job Description: ${jobDescription}

                        CRITICAL INSTRUCTIONS:
                        1. If the resume context contains parsing error messages or is empty, fallback entirely on the Self Description and target Job Description to craft a high-quality resume for a MERN stack/Full-stack role.
                        2. Do NOT output error messages or plain string placeholders like "text parsing failed" inside the HTML template. 
                        3. Use default realistic data fields if specific details like contact number or name are missing.
                        4. The output must be a complete, beautifully styled HTML structure optimized for an ATS-friendly A4 format with white background and dark text.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema,
            }
        });

        const responseText = response.text || response.candidates[0].content.parts[0].text;
        return JSON.parse(responseText);
    } catch (error) {
        console.error("❌ Error generating Resume inside AI service:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };