import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export default api; // Fixed to lowercase

// --- AUTH FUNCTIONS ---
export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", { username, email, password }); // Fixed to lowercase
        return response.data;
    } catch (err) {
        console.error("Register Error:", err);
        throw err; 
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password }); // Fixed to lowercase
        return response.data;
    } catch (err) {
        console.error("Login Error:", err);
        throw err;
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout"); // Fixed to lowercase
        return response.data;
    } catch (err) {
        console.error("Logout Error:", err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me"); // Fixed to lowercase
        return response.data;
    } catch (err) {
        throw err; 
    }
}

// --- INTERVIEW FUNCTIONS ---
export async function generateInterviewStrategy(payload) {
    try {
        const response = await api.post("/api/interview/1", payload); // Fixed to lowercase
        return response.data;
    } catch (err) {
        console.error("Interview Generation Error:", err);
        throw err;
    }
}