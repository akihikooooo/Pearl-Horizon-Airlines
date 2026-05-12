import { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const AdminRoutes = () => {
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(true);
    useEffect(() => {
        axios
            .get(`${apiUrl}/api/admin/permitted`)
            .then((ret) => {
                setAuthed(ret.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="pt-16">Loading...</div>;
    }
    return authed ? <Outlet /> : <div className="pt-16">Not Permitted. get outta here</div>;
};
