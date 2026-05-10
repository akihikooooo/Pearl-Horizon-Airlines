import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import "./stylesheets/account.css";

function AccountManagement() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    console.log(user);
    return (
        <>
            <div id="cont" className="pt-16 flex bg-dusk-warm">
                <div id="header">
                    <h1 className="text-4xl text-sky-white flex justify-center items-center">Account Management</h1>
                </div>
            </div>
            {user.permissions.includes("ADMINISTRATOR") ? (
                <div>
                    <button onClick={() => navigate("/admin", { replace: true })}>Admin Panel</button>
                </div>
            ) : (
                <></>
            )}
            <div>
                <button onClick={logout}>Logout</button>
            </div>
        </>
    );
}

export default AccountManagement;
