import api from "@/services/api";

/**
 * @description Service to generate interview report based on user details.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    
    // Safely append the resume file only if it exists to avoid empty string mismatches
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    // ✅ Fix: Removed trailing slash from "/api/interview/" to avoid Express routing mismatches
    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    // ✅ Fix: Removed trailing slash from "/api/interview/" to avoid Express routing mismatches
    const response = await api.get("/api/interview");
    return response.data;
};

/**
 * @description Service to generate resume pdf based on interview report.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });
    return response.data;
};