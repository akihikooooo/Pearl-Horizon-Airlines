import { NavLink } from "react-router-dom";
import InputField from "../../components/InputField";
import { useAuth } from "../../services/auth";
import { useState } from "react";
import ErrorLabel from "../../components/Error";

function Signup() {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [showMailError, setShowMailError] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordError, setShowPasswordError] = useState(false);
    const { signup } = useAuth();

    const handelEmail = () => {
        if (email != confirmEmail) {
            setShowMailError(true);
        } else {
            setShowMailError(false);
        }
    };
    const handlePassword = () => {
        if (password != confirmPassword) {
            setShowPasswordError(true);
        } else {
            setShowPasswordError(false);
        }
    }

    return (
        <>
            <div id="cont" className="flex justify-center items-center w-screen h-screen bg-horizon-tint">
                <div id="field" className="p-14 bg-sky-white flex justify-center items-center flex-col rounded-md shadow-2xl">
                    <div className="text-base md:text-2xl font-bold text-center leading-none">
                        Pearl <span className="text-horizon">Horizon</span> Airline <br />
                        Signup
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (email != confirmEmail || password != confirmPassword) {
                                return false;
                            }
                            signup({ email: email, password: password, first_name: e.target[0].value, last_name: e.target[1].value });
                        }}
                        id="form"
                        className="flex flex-col gap-2 p-2">
                        <div className="flex gap-2">
                            <InputField label="First Name" type="text" placeholder="John" required />
                            <InputField label="Last Name" type="text" placeholder="Doe" required />
                        </div>
                        <div id="email" className="flex gap-2">
                            <InputField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="E-mail"
                                type="email"
                                placeholder="johndoe@email.com"
                                required
                            />
                            <InputField
                                value={confirmEmail}
                                onChange={(e) => {
                                    setConfirmEmail(e.target.value);
                                    setShowMailError(false);
                                }}
                                label="Confirm E-mail"
                                type="email"
                                placeholder="johndoe@email.com"
                                error={email != confirmEmail && showMailError}
                                onBlur={() => setShowMailError(true)}
                                required
                            />
                        </div>
                        <div id="pw" className="flex gap-2">
                            <InputField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                type="password"
                                placeholder=""
                                required
                            />
                            <InputField
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setShowPasswordError(false);
                                }}
                                label="Confirm Password"
                                type="password"
                                placeholder=""
                                error={password != confirmPassword && showPasswordError}
                                onBlur={() => setShowPasswordError(true)}
                                required
                            />
                        </div>
                        <ErrorLabel error="Passwords do not match" />
                        <button type="submit" className="bg-horizon text-sky-white w-full rounded-md">
                            Sign-up
                        </button>
                    </form>
                    {/* <div id="form" className="flex flex-col gap-2 p-2">
                        <input />
                        <InputField value={email} onChange={(e) => {setEmail(e.target.value)}} label="E-mail" type="text" placeholder="johndoe@email.com" />
                        <InputField value={password} onChange={(e) => {setPassword(e.target.value)}} label="Password" type="password" placeholder="" />
                        <button
                            className="bg-horizon w-full rounded-md"
                            onClick={}>
                            Log-in
                        </button>
                    </div> */}
                    <p>
                        Have an account?{" "}
                        <NavLink to="/accounts/login" className="text-horizon">
                            Log in.
                        </NavLink>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signup;
