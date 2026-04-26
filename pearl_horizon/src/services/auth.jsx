import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/auth/check", {
                    credentials: "include",
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    console.log(userData)
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            // Replace with your actual login API call
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Important: allows server to set httpOnly cookie
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const userData = await response.json();
            setUser(userData);
            alert(1)
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                credentials: "include", // Important: sends cookie to be cleared
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}
