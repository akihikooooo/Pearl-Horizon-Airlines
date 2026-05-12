import "./stylesheets/account.css";
import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
function AdminPanel() {
    const [airports, setAirports] = useState({});
    const [airplanes, setAirplanes] = useState({});
    useEffect(() => {
        axios.get(`${apiUrl}/api/search/airports`).then((ret) => setAirports(ret.data));
        axios.get(`${apiUrl}/api/search/airplanes`).then((ret) => setAirplanes(ret.data));
    }, []);
    return (
        <>
            <div id="cont" className="pt-16 flex bg-dusk-warm">
                <div id="header">
                    <h1 className="text-4xl text-sky-white flex justify-center items-center">Admin Panel</h1>
                </div>
            </div>
            <div id="stats">
                <div className="flex gap-5 m-5">
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Users: x</div>
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Flights: x</div>
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Booked Flights: x</div>
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Next Flight: x</div>
                    {/* <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4"></div> */}
                </div>
            </div>
            <div id="changes">
                <div>
                    <p class>Add Airports</p>
                    <form className="grid grid-cols-5 gap-2">
                        <InputField label="Airport ID" />
                        <InputField label="Country" />
                        <InputField label="City" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p class>Add Airplanes</p>
                    <form className="grid grid-cols-5 gap-2">
                        <InputField label="Airplane ID" type="text" />
                        <InputField label="Model" type="text" />
                        <InputField label="Seating Capacity" type="number" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p class>Add Flights</p>
                    <form className="grid grid-cols-5 gap-2">
                        <InputField label="Flight ID" />
                        <select name="originAirport">
                            <option disabled selected>
                                Select an Airport...
                            </option>
                            {Object.entries(airports).map(([airportID, data]) => (
                                <option value={airportID}>
                                    {airportID} - {data.city}, {data.country}
                                </option>
                            ))}
                        </select>
                        <select name="destinationAirport">
                            <option disabled selected>
                                Select an Airport...
                            </option>
                            {Object.entries(airports).map(([airportID, data]) => (
                                <option value={airportID}>
                                    {airportID} - {data.city}, {data.country}
                                </option>
                            ))}
                        </select>
                        <select name="airplaneUsed">
                            <option disabled selected>
                                Select Airplane...
                            </option>
                            {Object.entries(airplanes).map(([airplaneID, data]) => (
                                <option value={airplaneID}>
                                    {data.model} - {data.seats} pax.
                                </option>
                            ))}
                        </select>
                        <select name="routeType">
                            <option disabled selected>
                                Select Route Type...
                            </option>
                            <option value="oneway">One Way</option>
                            <option value="roundtrip">Round Trip</option>
                        </select>
                        <InputField label="Departure Time" type="datetime-local" />
                        <InputField label="Flight Time" type="time" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p class>Modify User</p>
                    <form className="grid grid-cols-5 gap-2">
                        <InputField label="First Name" />
                        <InputField label="Last Name" />
                        <InputField label="Email" type="email" />
                        <InputField label="Password" type="password" />
                        <InputField label="Permissions" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AdminPanel;
