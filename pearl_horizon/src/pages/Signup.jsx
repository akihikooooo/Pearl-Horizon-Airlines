import { NavLink } from "react-router-dom";
import InputField from "../components/InputField";

function Signup() {
    // TODO: integrate signup to the auth process
    return (
        <>
            <div id="cont" className="flex justify-center items-center w-screen h-screen bg-horizon-tint">
                <div id="field" className="p-14 bg-sky-white flex justify-center items-center flex-col rounded-md shadow-2xl">
                    <div className="text-base md:text-2xl font-bold text-center leading-none">
                        Pearl <span className="text-horizon">Horizon</span> Airline <br />
                        Signup
                    </div>
                    <form onSubmit={1 + 1} id="form" className="flex flex-col gap-2 p-2">
                        <div className="flex gap-2">
                            <InputField label="First Name" type="text" placeholder="John" />
                            <InputField label="Last Name" type="text" placeholder="Doe" />
                        </div>
                        <div id="email" className="flex gap-2">
                            <InputField label="E-mail" type="text" placeholder="johndoe@email.com" />
                            <InputField label="Confirm E-mail" type="text" placeholder="johndoe@email.com" />
                        </div>
                        <div id="pw" className="flex gap-2">
                            <InputField label="Password" type="password" placeholder="" />
                            <InputField label="Confirm Password" type="password" placeholder="" />
                        </div>
                        <button className="bg-horizon w-full rounded-md">Log-in</button>
                    </form>
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
