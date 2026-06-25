import axios from "axios";

// Your exact configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'
});

export default API;

// --- AUTH FUNCTIONS ---

export async function register({ username, email, password }) {
    try {
        const response = await API.post("/register", { username, email, password });
        return response.data;
    } catch (err) {
        console.error("Register Error:", err);
        throw err; 
    }
}

export async function login({ email, password }) {
    try {
        const response = await API.post("/login", { email, password });
        return response.data;
    } catch (err) {
        console.error("Login Error:", err);
        throw err;
    }
}

export async function logout() {
    try {
        const response = await API.get("/logout");
        return response.data;
    } catch (err) {
        console.error("Logout Error:", err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await API.get("/get-me");
        return response.data;
    } catch (err) {
        throw err; 
    }
}

// --- INTERVIEW FUNCTIONS ---

// NEW: This fixes the localhost:3000/api/interview/1 error from your screenshot
export async function generateInterviewStrategy(payload) {
    try {
        // Appending /api/interview/1 directly to your baseURL setup
        const response = await API.post("/api/interview/1", payload);
        return response.data;
    } catch (err) {
        console.error("Interview Generation Error:", err);
        throw err;
    }
}