import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/auth";
import "../stylesheets/account.css";
import {InputField} from "../../components/InputField";
import ErrorLabel from "../../components/Error";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}H`);
    if (minutes > 0) parts.push(`${minutes}M`);

    return parts.join(" ");
}

function EditProfile({ onExit, user }) {
    const navigate = useNavigate();
    function onSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        for (const [_key, value] of form.entries()) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return false;
            }
        }
        axios
            .post(`${apiUrl}/api/auth/modify/user`, Object.fromEntries(form.entries()))
            .then(() => {
                e.target.reset();
                onExit(false);
                navigate(0);
            })
            .catch((error) => {
                alert("Something went wrong, Check Console");
                console.log(error);
            });
    }
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col w-1/2 border bg-sky-cloud gap-2 p-4 rounded-md">
            <h1>Edit Profile</h1>
            <form onSubmit={onSubmit} className="w-full">
                <InputField label="First Name" name="first_name" defaultValue={user.first_name} required />
                <InputField label="Last Name" name="last_name" defaultValue={user.last_name} required />
                <InputField label="Email" name="email" defaultValue={user.email} required />
                <button
                    className="flex justify-center items-center p-2 rounded-md border border-sky-cloud cursor-pointer hover:bg-horizon-deep hover:text-sky-white mx-auto"
                    type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

function EditPassword({ onExit }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    function onSubmit() {
        if (newPassword == "" || oldPassword == "" || !passwordCheck()) {
            return false;
        }
        axios
            .post(`${apiUrl}/api/auth/modify/password`, { old_password: oldPassword, new_password: newPassword })
            .then(() => {
                // e.target.reset();
                onExit(false);
                navigate(0);
            })
            .catch((error) => {
                alert("Something went wrong, Check Console");
                console.log(error);
            });
    }
    const passwordCheck = () => {
        console.log(newPassword, oldPassword);
        if (newPassword != confirmPassword) {
            setError(true);
            return false;
        } else {
            setError(false);
            return true;
        }
    };

    return (
        <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col w-1/2 border bg-sky-cloud gap-2 p-4 rounded-md">
            <h1>Edit Password</h1>
            <div className=" w-full">
                <InputField
                    label="Current Password"
                    name="current_password"
                    type="password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    value={oldPassword}
                    required
                />
                <InputField
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                    }}
                    label="New Password"
                    name="new_password"
                    value={newPassword}
                    type="password"
                />
                <InputField
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    label="Confirm New Password"
                    value={confirmPassword}
                    type="password"
                />
            </div>
            <ErrorLabel error={error} message="Password and Confirm Password must be same." />

            <button
                className="flex justify-center items-center p-2 rounded-md border border-sky-cloud cursor-pointer hover:bg-horizon-deep hover:text-sky-white"
                onClick={onSubmit}>
                Save Changes
            </button>
        </div>
    );
}

const BookedFlights = ({ flight }) => {
    return (
        <>
            <div
                id="cont"
                className="w-full border rounded-md border-horizon bg-dusk-pale flex justify-center items-center flex-col h-full my-2 shadow-md">
                <div className="flex gap-10 w-full pl-2 pt-2 font-medium">
                    <p className="w-1/10">{flight.flight_id}</p>
                    <p className="w-4/10">
                        {new Date(flight.departure_timestamp * 1000).toLocaleDateString([], {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                    <p className="w-4/10">
                        {flight.title}. {flight.first_name} {flight.last_name}
                    </p>
                    <p className="w-1/10">{flight.seat_no}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-stretch w-full h-full gap-0 pl-2 pt-2">
                    <div id="flight-info" className="w-full h-full md:w-2/3 font-medium flex items-start justify-center flex-col">
                        <div className="flex items-center justify-center gap-10 w-full">
                            <span id="origin" className="flex justify-center items-center flex-col gap-0">
                                {new Date(flight.departure_timestamp * 1000).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                                <p className="uppercase">{flight.origin_airport_id}</p>
                            </span>
                            <span id="graphics" className="flex justify-center items-center text-horizon-deep gap-2 flex-1 w-full">
                                <span className="material-symbols-outlined">flight_takeoff</span>
                                <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" />
                                <span className="material-symbols-outlined">flight_land</span>
                            </span>
                            <span id="destination" className="flex justify-center items-center flex-col gap-0">
                                <p>
                                    {new Date((flight.departure_timestamp + flight.flight_time) * 1000).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </p>
                                <p className="uppercase">{flight.destination_airport_id}</p>
                            </span>
                        </div>
                        <div className="flex px-2 gap-0 border-t-2 border-horizon-deep w-full">
                            <p>Flight Duration: {formatTime(flight.flight_time)}</p>
                        </div>
                    </div>
                    <div id="flight-price" className="md:w-1/3 flex items-stretch justify-end gap-4 pr-4 font-medium text-xl">
                        <button onClick={() => {}} className={`text-xs h-1/2 bg-horizon text-white px-4 py-2 rounded-sm self-center`}>
                            Show Details
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

function AccountManagement() {
    const [isEditing, setIsEditing] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    useEffect(() => {
        axios
            .get(`${apiUrl}/api/auth/userDetails`)
            .then((ret) => {
                setUserData(ret.data);
                setLoading(false);
                console.log(ret.data);
            })
            .catch((err) => {
                alert("Something went wrong.");
                console.error(err);
            });
    }, [isEditing]);

    const handleChange = (status) => {
        setIsEditing(status);
        setIsPassword(status);
    };

    return (
        <>
            <div id="cont" className="pt-16 flex justify-center items-center">
                {/* <div id="header" className="flex bg-dusk-warm">
                    <h1 className="text-4xl text-sky-white flex justify-center items-center">Account Management</h1>
                </div> */}
                <div className="flex flex-col justify-center items-center w-full">
                    {/* <h1 className="text-3xl">Account Management</h1> */}
                    <div className="flex flex-col justify-center items-center mb-4">
                        <span id="account-icon" className="material-symbols-outlined">
                            account_circle
                        </span>
                        <h1 className="text-2xl text-horizon">User Profile</h1>
                    </div>
                    <div className="bg-horizon-deep rounded-md flex flex-col = text-sky-white gap-2 p-4 w-5/12">
                        <div id="details" className="flex">
                            <div className="flex flex-col gap-0 text-xl w-36">
                                <span className="">First Name: </span>
                                <span className="">Last Name: </span>
                                <span className="">Email:</span>
                            </div>
                            <div className="flex flex-col gap-0 text-xl">
                                <span className="">{user.first_name}</span>
                                <span className="">{user.last_name}</span>
                                <span className="">{userData.email}</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {user.permissions.includes("ADMINISTRATOR") ? (
                                <button
                                    className="flex justify-center items-center p-2 rounded-md border border-sky-white cursor-pointer hover:bg-horizon-deep"
                                    onClick={() => navigate("/admin")}>
                                    <span className="material-symbols-outlined text-sky-white">edit</span>
                                    Admin Panel
                                </button>
                            ) : (
                                <></>
                            )}
                            <button
                                className="flex justify-center items-center p-2 rounded-md border border-sky-white cursor-pointer hover:bg-horizon-deep"
                                onClick={() => setIsEditing(true)}>
                                <span className="material-symbols-outlined text-sky-white">edit</span>
                                Modify User
                            </button>
                            <button
                                className="flex justify-center items-center p-2 rounded-md border border-sky-white cursor-pointer hover:bg-horizon-deep"
                                onClick={() => setIsPassword(true)}>
                                <span className="material-symbols-outlined text-sky-white">edit</span>
                                Change Password
                            </button>
                            <button
                                className="flex justify-center items-center p-2 rounded-md border border-sky-white cursor-pointer hover:bg-horizon-deep"
                                onClick={logout}>
                                <span className="material-symbols-outlined text-sky-white">edit</span>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="flights" className="flex justify-center items-center flex-col w-full gap-4 mt-4">
                <h1 id="flight-header" className="text-2xl text-horizon">
                    My Flights
                </h1>
                <div className="flex justify-center items-center flex-col w-5/12 gap-4">
                    {loading ? <div>Loading...</div> : (userData.booked_flights.length == 0 ? <div>No Bookings found.</div> : userData.booked_flights.map((flight, i) => <BookedFlights flight={flight} key={i} />))}
                </div>
            </div>

            {/* Pop-ups */}
            <div className={`w-full h-full bg-black opacity-50 fixed top-0 z-0 ${isEditing || isPassword ? "" : "hidden"}`} />
            <div className={`fixed inset-0 flex justify-center items-center w-full z-30 ${isEditing ? "" : "hidden"}`}>
                <EditProfile onExit={handleChange} user={userData} />
            </div>
            <div className={`flex justify-center items-center w-full z-30 ${isPassword ? "" : "hidden"}`}>
                <EditPassword onExit={handleChange} />
            </div>
        </>
    );
}

export default AccountManagement;
