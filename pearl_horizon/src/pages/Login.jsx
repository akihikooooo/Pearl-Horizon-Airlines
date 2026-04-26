import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <div id="cont" className="flex justify-center items-center w-screen h-screen bg-horizon-tint">
                <div id="field" className="p-14 bg-sky-cloud flex justify-center items-center flex-col rounded-md shadow-2xl">
                    <div className="text-base md:text-2xl font-bold text-center leading-none">
                        Pearl <span className="text-horizon">Horizon</span> Airline <br />
                        Login
                    </div>
                    <form onSubmit={1 + 1} id="form" className="flex flex-col gap-2 p-2">
                        <BookingField
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            label="E-mail"
                            type="text"
                            placeholder="johndoe@email.com"
                        />
                        <BookingField
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
                            className="bg-horizon w-full rounded-md"
                        >
                            Log-in
                        </button>
                    </form>
                    <p>
                        Don't have an account?{" "}
                        <NavLink to="/accounts/signup" className="text-horizon">
                            Sign Up.
                        </NavLink>
                    </p>
                </div>
            </div>
        </>
    );
}

const BookingField = ({ label, value, onChange, ...inputProps }) => (
    <div>
        <label className="block text-sm font-semibold md:tracking-[0.15em] text-horizon uppercase mb-1.5">{label}</label>
        <input
            {...inputProps}
            name={label}
            value={value}
            onChange={onChange}
            className="md:text-sm w-full bg-sky-cloud border border-sky-slate px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm"
        />
    </div>
);

export default Login;
