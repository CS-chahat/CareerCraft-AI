import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import axios from "axios" // ✅ Added for direct blob response tracking overrides

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            
            // 🛡️ Normalization fallback block
            const targetData = response?.interviewReport || response?.data?.interviewReport || response?.data || response;
            
            if (targetData) {
                setReport(targetData)
                return targetData
            }
        } catch (error) {
            console.error("Hook Error generating report:", error)
            alert("Could not connect to the live backend server. Please verify your network connection and Render configuration.")
        } finally {
            setLoading(false)
        }
        return null
    }

    const getReportById = async (id) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(id)
            
            // 🛡️ Normalization fallback block to prevent undefined skips
            const targetData = response?.interviewReport || response?.data?.interviewReport || response?.data || response;
            
            if (targetData) {
                setReport(targetData)
                return targetData
            }
        } catch (error) {
            console.error("Error fetching report by ID:", error)
        } finally {
            setLoading(false)
        }
        return null
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            
            // 🛡️ Normalization fallback block
            const targetList = response?.interviewReports || response?.data?.interviewReports || response?.data || response;
            
            if (Array.isArray(targetList)) {
                setReports(targetList)
                return targetList
            }
        } catch (error) {
            console.error("Error fetching all reports:", error)
        } finally {
            setLoading(false)
        }
        return []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            // 🛡️ Explicitly pull the file stream using an override config to handle binary data buffers
            const response = await axios.get(
                `https://careercraft-ai-8v2u.onrender.com/interview/resume/${interviewReportId}`,
                { responseType: "blob" }
            );

            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([ response.data ], { type: "application/pdf" }))
                const link = document.createElement("a")
                link.href = url
                link.setAttribute("download", `resume_${interviewReportId}.pdf`)
                document.body.appendChild(link)
                
                link.click() // ✅ Triggers browser file compilation manager system
                
                // Cleanup browser DOM elements and object tracking instances
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            }
        }
        catch (error) {
            console.error("Error downloading file via binary link generation stream:", error)
            alert("Failed to download file payload data. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}