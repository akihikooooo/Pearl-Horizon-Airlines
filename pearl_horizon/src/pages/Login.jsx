import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../services/auth";
import InputField from "../components/InputField";
function Login() {
    const { login, logout } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <title>Login | Pearl Horizon Airlines</title>
            <div id="cont" className="flex justify-center items-center w-screen h-screen bg-horizon-tint">
                <div id="field" className="p-14 bg-sky-white flex justify-center items-center flex-col rounded-md shadow-2xl">
                    <div className="text-base md:text-2xl font-bold text-center leading-none">
                        Pearl <span className="text-horizon">Horizon</span> Airline <br />
                        Login
                    </div>
                    <div id="form" className="flex flex-col gap-2 p-2">
                        <InputField
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            label="E-mail"
                            type="text"
                            placeholder="johndoe@email.com"
                        />
                        <InputField
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            label="Password"
                            type="password"
                            placeholder=""
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                login({ email: email, password: password });
                            }}
                            className="bg-horizon w-full rounded-md">
                            Log-in
                        </button>
                    </div>
                    <p>
                        Don't have an account?{" "}
                        <NavLink to="/accounts/signup" className="text-horizon">
                            Sign Up.
                        </NavLink>
                    </p>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </>
    );
}


export default Login;
