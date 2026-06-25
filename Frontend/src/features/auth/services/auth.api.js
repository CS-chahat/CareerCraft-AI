

import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await API.post("/register", { username, email, password });
        return response.data;
    } catch (err) {
        console.error("Register Error:", err);
        throw err; // Throwing error so useAuth knows it failed
    }
}

// FIX: Destructured { email, password } to match how you call it in useAuth
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
        // Do not use console.log here to prevent spamming console logs on every boot 
        throw err; 
    }
}