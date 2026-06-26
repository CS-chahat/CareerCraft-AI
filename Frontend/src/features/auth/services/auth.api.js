import axios from "axios";

const API = axios.create({
  // Fixed for Vite environment variables
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true // Crucial if you are using cookie-parser on the backend
});

export default API;

// --- AUTH FUNCTIONS ---
// Added "/api/auth" prefix to match your backend app.js configuration

export async function register({ username, email, password }) {
    try {
        const response = await API.post("/api/auth/register", { username, email, password });
        return response.data;
    } catch (err) {
        console.error("Register Error:", err);
        throw err; 
    }
}

export async function login({ email, password }) {
    try {
        const response = await API.post("/api/auth/login", { email, password });
        return response.data;
    } catch (err) {
        console.error("Login Error:", err);
        throw err;
    }
}

export async function logout() {
    try {
        const response = await API.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.error("Logout Error:", err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await API.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        throw err; 
    }
}

// --- INTERVIEW FUNCTIONS ---

export async function generateInterviewStrategy(payload) {
    try {
        // Your backend already prefixes this with "/api/interview", 
        // so you only need to post to "/1" or whatever the remaining route parameter is.
        const response = await API.post("/api/interview/1", payload); 
        return response.data;
    } catch (err) {
        console.error("Interview Generation Error:", err);
        throw err;
    }
}