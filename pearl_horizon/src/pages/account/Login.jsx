import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth";
import InputField from "../../components/InputField";
import ErrorLabel from "../../components/Error";
function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    return (
        <>
            <title>Login | Pearl Horizon Airlines</title>
            <div id="cont" className="flex justify-center items-center w-screen h-screen bg-horizon-tint">
                <div id="field" className="p-14 w-4/12 bg-sky-white flex justify-center items-center flex-col rounded-md shadow-2xl">
                    <div className="w-full text-base md:text-2xl font-bold text-center leading-none">
                        Pearl <span className="text-horizon">Horizon</span> Airline <br />
                        Login
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const ret = await login({ email: email, password: password });
                            if (!ret.success) setError(ret.details);
                        }}
                        id="form"
                        className="w-full flex flex-col gap-2 p-2">
                        <InputField
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            label="E-mail"
                            type="text"
                            placeholder="johndoe@email.com"
                        />
                        <InputField
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            label="Password"
                            type="password"
                            placeholder=""
                        />
                        <ErrorLabel error="Incorrect Password" />
                        <button type="submit" className="bg-horizon text-sky-white w-full rounded-md">
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

export default Login;
