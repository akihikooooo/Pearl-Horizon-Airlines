import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
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
            axios
                .post("http://localhost:8000/api/auth/login", credentials, {

                })
                .then((response) => console.log(response))
                .catch(() => {
                    throw new Error("Login failed");
                });

            // setUser(userData);
            // navigate("/", { replace: true });
            // window.location.reload(); // Hard refresh of the entire document
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:8000/api/auth/logout", {
                method: "POST",
                credentials: "include", // Important: sends cookie to be cleared
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    };
    const signup = async (credentials) => {
        try {
            const response = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(credentials),
            });
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };
    const value = {
        user,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export const ProtectedRoutes = () => {
    // Replace this with your actual auth logic (e.g., from Context or Redux)
    const checkAuth = () => {
        const response = axios
            .get("http://localhost:8000/api/auth/check", {
                withCredentials: true,
            })
            .then(() => true)
            .catch(() => false);
        console.log(response);
        return response;
    };
    const isAuthenticated = checkAuth();
    console.log(isAuthenticated ? "true" : "false ");

    return isAuthenticated ? <Outlet /> : <Navigate to="/accounts/login" replace />;
};
