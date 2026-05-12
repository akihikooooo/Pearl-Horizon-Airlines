import "./stylesheets/account.css";
import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
function AdminPanel() {
    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(true);
    function newAirportSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        for (const [_key, value] of form.entries()) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return false;
            }
        }
        axios
            .post(`${apiUrl}/api/admin/add/airport`, Object.fromEntries(form.entries()))
            .then(() => {
                e.target.reset();
                toast("Success");
                refreshData();
            })
            .catch((error) => {
                toast("Something went wrong, Check Console");
                console.log(error);
            });
    }

    function newAirplaneSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        for (const [_key, value] of form.entries()) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return false;
            }
        }
        axios
            .post(`${apiUrl}/api/admin/add/airplane`, Object.fromEntries(form.entries()))
            .then(() => {
                e.target.reset();
                toast("Success");
                refreshData();
            })
            .catch((error) => {
                toast("Something went wrong, Check Console");
                console.log(error);
            });
    }
    function newFlightSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        for (const [_key, value] of form.entries()) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return false;
            }
        }
        form.set("departure_time", Date.parse(form.get("departure_time")) / 1000);
        form.set("flight_time", (parseInt(form.get("flight_hour") * 60, 10) + parseInt(form.get("flight_minute"), 10)) * 60);
        form.delete("flight_hour");
        form.delete("flight_minute");
        axios
            .post(`${apiUrl}/api/admin/add/flight`, Object.fromEntries(form.entries()))
            .then(() => {
                e.target.reset();
                toast("Success");
                refreshData();
            })
            .catch((error) => {
                toast("Something went wrong, Check Console");
                console.log(error);
            });
    }
    function modifyUserSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        for (const [_key, value] of form.entries()) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return false;
            }
        }
        axios
            .post(`${apiUrl}/api/admin/modify/user`, Object.fromEntries(form.entries()))
            .then(() => {
                e.target.reset();
                toast("Success");
                refreshData();
            })
            .catch((error) => {
                toast("Something went wrong, Check Console");
                console.log(error);
            });
    }
    function refreshData() {
        axios.get(`${apiUrl}/api/admin/dashboard`).then((ret) => {
            setDashboardData(ret.data);
            setLoading(false);
        });
    }
    useEffect(() => {
        refreshData();
    }, []);

    if (loading) return <div>Loading...</div>;
    function dateNow() {
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        return localISO;
    }
    return (
        <>
            <div id="cont" className="pt-16 flex bg-dusk-warm">
                <div id="header">
                    <h1 className="text-4xl text-sky-white flex justify-center items-center">Admin Panel</h1>
                </div>
            </div>
            <div id="stats">
                <div className="flex gap-5 m-5">
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Users: {dashboardData.total_users}</div>
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Flights: {dashboardData.total_flights}</div>
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Booked Seats: {dashboardData.total_booked_seats}</div>
                    <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">
                        Next Flight: {dashboardData.next_flight ? (
                            <>
                                <p>{dashboardData.next_flight.flight_id}</p>
                                <p>
                                    {new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "full",
                                        timeStyle: "long",
                                    }).format(dashboardData.next_flight.departure_timestamp * 1000)}
                                </p>
                            </>
                    ) : <></>}
                    </div>
                    {/* <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4"></div> */}
                </div>
            </div>
            <hr />
            <div id="changes" className="m-5">
                <div>
                    <p class>Add Airports</p>
                    <form onSubmit={newAirportSubmit} className="grid grid-cols-5 gap-2">
                        <InputField label="Airport ID" name="airport_id" required placeholder="MNL" pattern="[A-Z]{3}" />
                        <InputField label="Country" name="country" required placeholder="Philippines" />
                        <InputField label="City" name="city" required placeholder="Manila" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p class>Add Airplanes</p>
                    <form onSubmit={newAirplaneSubmit} className="grid grid-cols-5 gap-2">
                        <InputField
                            label="Airplane ID"
                            name="airplane_id"
                            type="text"
                            required
                            pattern="PH[A-Z][0-9]{3}-[A-Z]"
                            placeholder="PHA777-A"
                        />
                        <InputField label="Model" name="model" type="text" required placeholder="Boeing 777-300" />
                        <InputField label="Seating Capacity" name="capacity" type="number" required min="1" placeholder="350" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p class>Add Flights</p>
                    <form onSubmit={newFlightSubmit} className="grid grid-cols-5 gap-2">
                        <InputField label="Flight ID" name="flight_id" required pattern="PH[0-9]{4}" placeholder="PH0000" />
                        <select name="origin_airport" required>
                            <option value="" disabled selected>
                                Select an Airport...
                            </option>
                        {Object.entries(dashboardData.airports_available).map(([airportID, data]) => (
                            <option value={airportID}>
                                {airportID} - {data.city}, {data.country}
                            </option>
                        ))}
                        </select>
                        <select name="destination_airport" required>
                            <option value="" disabled selected>
                                Select an Airport...
                            </option>
                            {Object.entries(dashboardData.airports_available).map(([airportID, data]) => (
                                <option value={airportID}>
                                    {airportID} - {data.city}, {data.country}
                                </option>
                            ))}
                        </select>
                        <select name="airplane_used" required>
                            <option selected disabled value="">
                                Select Airplane...
                            </option>
                            {Object.entries(dashboardData.airplanes_available).map(([airplaneID, data]) => (
                                <option value={airplaneID}>
                                    {data.model} - {data.seats} pax.
                                </option>
                            ))}
                        </select>
                        <select name="route_type" required>
                            <option disabled selected value="">
                                Select Route Type...
                            </option>
                            <option value="oneway">One Way</option>
                            <option value="roundtrip">Round Trip</option>
                        </select>
                        <InputField label="Departure Time" name="departure_time" type="datetime-local" required min={dateNow()} />
                        <InputField label="Flight Hour" name="flight_hour" type="number" required min="0" />
                        <InputField label="Flight Minute" name="flight_minute" type="number" min="0" max="59" required />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p class>Modify User</p>
                    <form onSubmit={modifyUserSubmit} className="grid grid-cols-5 gap-2">
                        <select name="user">
                            <option value="" disabled selected>
                                Select a user...
                            </option>
                            {dashboardData.users.map((user, i) => (
                                <option key={i} value={user.email}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <select name="field">
                            <option value="" disabled selected>Select a field...</option>
                            <option value="first_name">First Name</option>
                            <option value="last_name">Last Name</option>
                            <option value="password">Password</option>
                            <option value="permissions">Permissions</option>
                        </select>
                        <InputField label="Value" name="value" type="text" required/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default AdminPanel;
