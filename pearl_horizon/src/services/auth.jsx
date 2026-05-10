import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
const AuthContext = createContext(null);
const apiUrl = import.meta.env.VITE_BACKEND_URL;
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        // TODO: error handling, need ko ng qa test dito
        setLoading(true);
        const ret = axios
            .post(`${apiUrl}/api/auth/login`, credentials, {})
            .then(async () => {
                await checkAuth(true);
                navigate("/", { replace: true });
                return { success: true };
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response) {
                    if (error.response.status == 401) {
                        // invalid credentials
                        return { success: false, details: error.response.data.detail };
                    } else {
                        console.error(error);
                    }
                } else {
                    console.error(error);
                }
            })
            .finally(setLoading(false));

        return ret;
    };

    const logout = async () => {
        setLoading(true);
        axios
            .post(`${apiUrl}/api/auth/logout`)
            .then(() => setUser(null))
            .catch((error) => {
                console.error("Logout failed:", error);
            })
            .finally(() => setLoading(false));
    };

    const signup = async (credentials) => {
        try {
            const _data = axios.post(`${apiUrl}/api/auth/signup`, credentials, {}).then(() => navigate("/accounts/login", { replace: true }));
        } catch (error) {
            console.log(error);
        }
    };

    const checkAuth = async (skipLoading = false) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/auth/check`, {
                credentials: "include",
            });
            if (response.ok) {
                const userData = await response.json();

                userData.permissions = userData.permissions ? userData.permissions.split(" ") : [];
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            if (!skipLoading) setLoading(false);
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

export const ProtectedRoutes = ({ accounts = false }) => {
    const { checkAuth, authed, loading } = useAuth();
    useEffect(() => {
        checkAuth();
    }, []);

    if (loading) {
        return <div className="pt-16">Loading...</div>;
    }
    if (accounts) {
        return authed ? <Navigate to="/accounts" replace /> : <Outlet />;
    } else {
        return authed ? <Outlet /> : <Navigate to="/accounts/login" replace />;
    }
};

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}
