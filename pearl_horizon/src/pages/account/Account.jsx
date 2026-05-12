import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../services/auth";
import "../stylesheets/account.css";
import InputField from "../../components/InputField";
import ErrorLabel from "../../components/Error";
import { useSearchParams } from "react-router-dom";

function EditProfile({ onExit }) {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col w-1/2 border bg-sky-cloud gap-2 p-4 rounded-md">
            <h1>Edit Profile</h1>
            <div className="w-full">
                <InputField label="First Name" value="Akihiko"/>
                <InputField label="Last Name" value="Tanaka"/>
                <InputField label="Email" value="akihiko@akihikooooo.xyz"/>
                <InputField label="Phone" value="123-456-7890"/>
            </div>
            <button className="flex justify-center items-center p-2 rounded-md border border-sky-cloud cursor-pointer hover:bg-horizon-deep hover:text-sky-white" onClick={() => {alert("Changes saved!"); onExit(false)}}>
                Save Changes
            </button>
    </div>)
}

function EditPassword({ onExit }) {
    const [password,setPassword] = useState();
    const [confirmpassword, setConfirmPassword] = useState();
    const [error, setError] = useState(false);

    const passwordCheck = () => {
        if (password != confirmpassword){
            setError(true);
        } else {
            setError(false);
        }
    }

    return(
        <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col w-1/2 border bg-sky-cloud gap-2 p-4 rounded-md">
            <h1>Edit Password</h1>
            <div className=" w-full">
                <InputField label="Current Password" type="password"/>
                <InputField onChange={(e) => {
                                    setPassword(e.target.value)
                                    passwordCheck;
                                }} label="New Password" type="password"/>
                <InputField onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    passwordCheck;
                                }} label="Confirm New Password" type="password"/>
            </div>
            <div className={` ${error ? "flex" : "hidden"}`}>
                <ErrorLabel error="Password and Confirm Password must be same."/>
            </div>
            <button className="flex justify-center items-center p-2 rounded-md border border-sky-cloud cursor-pointer hover:bg-horizon-deep hover:text-sky-white" onClick={() => {alert("Changes saved!"); onExit(false)}}>
                Save Changes
            </button>
    </div>
    )
}

const RenderResults = ({  }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passengers = parseInt(searchParams.get("passengers")) || 1;
    const bookFlight = (flightID) => {
        console.log(flightID);
        navigate({
            pathname: "/booking",
            search: `?${createSearchParams({
                passengers: passengers,
                bookingID: "d12k",
                flightID: flightID,
            })}`,
        });
    };
    // console.log(result);
    return (
        <>
            <div
                id="cont"
                className="w-full border rounded-md border-horizon bg-dusk-pale flex justify-center items-center flex-col h-full my-2 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-stretch w-full h-full gap-0 pl-2 pt-2">
                    <div id="flight-info" className="w-full h-full md:w-1/2 font-medium flex items-start justify-center flex-col">
                        <div>Flight ID</div>
                        <div className="flex items-center justify-center gap-10 w-full">
                            <span id="origin" className="flex justify-center items-center flex-col gap-0">
                                <p className="">
                                    dsadu
                                </p>
                                <p className="uppercase">mnl</p>
                            </span>
                            <span id="graphics" className="flex justify-center items-center text-horizon-deep gap-2 flex-1 w-full">
                                <span className="material-symbols-outlined">flight_takeoff</span>
                                <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" />
                                <span className="material-symbols-outlined">flight_land</span>
                            </span>
                            <span id="destination" className="flex justify-center items-center flex-col gap-0">
                                <p>
                                   dsadsa
                                </p>
                                <p className="uppercase">ceb</p>
                            </span>
                        </div>
                        <div className="flex px-2 gap-0 border-t-2 border-horizon-deep w-full">
                            <p>Flight Duration: dsfdsf</p>
                        </div>
                    </div>
                    <div id="flight-price" className="md:w-1/2 flex items-stretch justify-end gap-4 pr-4 font-medium text-xl">
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
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    console.log(user);

    const handleChange = (status) =>{
    setIsEditing(status);
    setIsPassword(status);
}

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
                                <span className="">Phone:</span>
                            </div><div className="flex flex-col gap-0 text-xl">
                                <span className="">Akihiko</span>
                                <span className="">Tanaka</span>
                                <span className="">akihiko@akihikooooo.xyz</span>
                                <span className="">123-456-7890</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button className="flex justify-center items-center p-2 rounded-md border border-sky-white cursor-pointer hover:bg-horizon-deep" onClick={() => setIsEditing(true)}>
                                <span className="material-symbols-outlined text-sky-white">edit</span>
                                Modify
                            </button>
                            <button className="flex justify-center items-center p-2 rounded-md border border-sky-white cursor-pointer hover:bg-horizon-deep" onClick={() => setIsPassword(true)}>
                                <span className="material-symbols-outlined text-sky-white">edit</span>
                                Change Password
                            </button>
                            </div>
                    </div>
                </div>
            </div>
            <div id="flights" className="flex justify-center items-center flex-col w-full gap-4 mt-4">
                    <h1 id="flight-header" className="text-2xl text-horizon">My Flights</h1>
                    <div className="flex justify-center items-center flex-col w-5/12 gap-4">
                        <RenderResults/>
                    </div>
                </div>

            {/* Pop-ups */}
            <div className={`w-full h-full bg-black opacity-50 absolute top-0 z-0 ${isEditing || isPassword ? "" : "hidden"}`}/>
            <div className={`flex justify-center items-center w-full z-30 ${isEditing ? "" : "hidden"}`}>
                <EditProfile onExit={handleChange} />
            </div>
                <div className={`flex justify-center items-center w-full z-30 ${isPassword ? "" : "hidden"}`}>
                    <EditPassword onExit={handleChange} />
                </div>
                
            <div>
                <button onClick={logout}>Logout</button>
            </div>
        </>
    );
}

export default AccountManagement;
