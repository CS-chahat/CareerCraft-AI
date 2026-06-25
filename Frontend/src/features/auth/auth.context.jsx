import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                // Make sure data and data.user actually exist
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null); // Fallback if API response is empty/falsy
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null); // 💡 CRITICAL: Ensure user is strictly null if the request fails
            } finally {
                setLoading(false); // Always stop loading
            }
        };
        getAndSetUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};