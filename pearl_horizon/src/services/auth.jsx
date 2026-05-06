import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext(null);
const apiUrl = import.meta.env.VITE_BACKEND_URL
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        // TODO: error handling, need ko ng qa test dito
        const data = axios
            .post(`${apiUrl}/api/auth/login`, credentials, {})
            .then(async () => {
                await checkAuth();
                navigate("/", { replace: true });
                return { success: true };
            })
            .catch(() => {
                throw new Error("Login failed"); // TODO: if signup failed, return an error
            });
        return data;
    };

    const logout = async () => {
        try {
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: "POST",
                credentials: "include", // Important: sends cookie to be cleared
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null)
        }
    };

    const signup = async (credentials) => {
        try {
            const _data = axios.post(`${apiUrl}/api/auth/signup`, credentials, {}).then(() => navigate("/login", { replace: true }));
        } catch (error) {
            console.log(error);
        }
    };

    const checkAuth = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/api/auth/check`, {
                credentials: "include",
            });
            console.log(response)
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
    useEffect(() => {
        checkAuth();
    }, []);
    const value = {
        user,
        login,
        logout,
        signup,
        checkAuth,
        authed: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const ProtectedRoutes = () => {
    const { checkAuth, authed, loading } = useAuth();
    useEffect(() => {
        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    return authed ? <Outlet /> : <Navigate to="/accounts/login" replace />;
};

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}
