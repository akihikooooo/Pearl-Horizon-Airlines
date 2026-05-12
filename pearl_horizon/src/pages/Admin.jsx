// import "./stylesheets/account.css";
import "./stylesheets/admin.css";
import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
function AdminPanel() {
    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState("Dashboard");
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
            <div id="cont" className="pt-16 flex bg-sky-cloud">
                <div id="sidebar" className="w-3/12 h-screen bg-sky-white p-6 flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-horizon">Admin Menu</h2>
                    {["Dashboard", "Manage Airports", "Manage Flight", "Manage Users"].map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                setPage(item);
                            }}
                            className={`text-horizon rounded-md p-2 hover:text-horizon-deep ${page === item ? "bg-horizon text-white" : ""}`}>
                            {item}
                        </button>
                    ))}
                </div>
                <div id="content" className="w-full overflow-scroll p-2">
                    {page === "Dashboard" && <Dashboard dashboardData={dashboardData} />}
                    {page === "Manage Airports" && <ManageAirport newAirportSubmit={newAirportSubmit} />}
                    {page === "Manage Flight" && <AddFlight newFlightSubmit={newFlightSubmit} dashboardData={dashboardData} dateNow={dateNow} />}
                    {page === "Manage Users" && <ModifyUser modifyUserSubmit={modifyUserSubmit} dashboardData={dashboardData} />}
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

function Dashboard({ dashboardData }) {
    return (
        <div id="stats">
            <div className="flex gap-5 m-5">
                <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Users: {dashboardData.total_users}</div>
                <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Flights: {dashboardData.total_flights}</div>
                <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">Total Booked Seats: {dashboardData.total_booked_seats}</div>
                <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4">
                    Next Flight:{" "}
                    {dashboardData.next_flight ? (
                        <>
                            <p>{dashboardData.next_flight.flight_id}</p>
                            <p>
                                {new Intl.DateTimeFormat("en-US", {
                                    dateStyle: "full",
                                    timeStyle: "long",
                                }).format(dashboardData.next_flight.departure_timestamp * 1000)}
                            </p>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
                {/* <div className="flex-1 h-32 bg-amber-100 rounded-lg shadow-md p-4"></div> */}
            </div>
        </div>
    );
}

function ManageAirport({ newAirportSubmit }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div id="topbar" className="flex items-center justify-end p-4">
                <button
                    className="bg-green-600 text-white p-2 rounded-md"
                    onClick={() => setOpen(true)}
                >
                    Add Airport
                </button>
            </div>

            <div id="table" className="w-full">
                <div className="table-row table-heading">
                    <div className="table-cell">Airport ID</div>
                    <div className="table-cell">Country</div>
                    <div className="table-cell">City</div>
                    <div className="table-cell"></div>
                </div>
                    <div className="table-row">
                        <div className="table-cell">MNL</div>
                        <div className="table-cell">Philippines</div>
                        <div className="table-cell">Manila</div>
                        <div className="table-cell">
                            <button className="flex justify-center items-center text-white bg-red-500 p-2 rounded-md">
                                <span className="material-symbols-outlined">delete</span>
                                Delete
                            </button>
                        </div>
                    </div>
            </div>

            <div
                className={`fixed inset-0 bg-black/50 z-10 ${
                    open ? "block" : "hidden"
                }`}
            ></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}
            >
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">
                    Add Airport
                </h1>

                <form onSubmit={newAirportSubmit} className="grid grid-cols-5 gap-3">
                    <InputField
                        label="Airport ID"
                        name="airport_id"
                        required
                        placeholder="MNL"
                        pattern="[A-Z]{3}"
                    />

                    <InputField
                        label="Country"
                        name="country"
                        required
                        placeholder="Philippines"
                    />

                    <InputField
                        label="City"
                        name="city"
                        required
                        placeholder="Manila"
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white rounded-md"
                    >
                        Submit
                    </button>
                </form>

                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-2 right-2"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

function AddFlight({ newFlightSubmit, dashboardData, dateNow }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div id="topbar" className="flex items-center justify-end p-4">
                <button
                    className="bg-green-600 text-white p-2 rounded-md"
                    onClick={() => setOpen(true)}
                >
                    Add Flight
                </button>
            </div>

            <div id="table" className="w-full">
                <div className="table-row table-heading">
                    <div className="table-cell">Flight ID</div>
                    <div className="table-cell">Origin</div>
                    <div className="table-cell">Destination</div>
                    <div className="table-cell">Airplane</div>
                    <div className="table-cell"></div>
                </div>

                {dashboardData.flights?.map((flight, i) => (
                    <div key={i} className="table-row">
                        <div className="table-cell">{flight.flight_id}</div>
                        <div className="table-cell">{flight.origin_airport}</div>
                        <div className="table-cell">{flight.destination_airport}</div>
                        <div className="table-cell">{flight.airplane_used}</div>

                        <div className="table-cell">
                            <button className="flex justify-center items-center text-white bg-red-500 p-2 rounded-md">
                                <span className="material-symbols-outlined">delete</span>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`fixed inset-0 bg-black/50 z-10 ${
                    open ? "block" : "hidden"
                }`}
            ></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}
            >
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">
                    Add Flight
                </h1>

                <form onSubmit={newFlightSubmit} className="grid grid-cols-5 gap-3">
                    <InputField
                        label="Flight ID"
                        name="flight_id"
                        required
                        pattern="PH[0-9]{4}"
                        placeholder="PH0000"
                    />

                    <select name="origin_airport" required>
                        <option value="" disabled selected>
                            Select an Airport...
                        </option>

                        {Object.entries(dashboardData.airports_available).map(([airportID, data]) => (
                            <option key={airportID} value={airportID}>
                                {airportID} - {data.city}, {data.country}
                            </option>
                        ))}
                    </select>

                    <select name="destination_airport" required>
                        <option value="" disabled selected>
                            Select an Airport...
                        </option>

                        {Object.entries(dashboardData.airports_available).map(([airportID, data]) => (
                            <option key={airportID} value={airportID}>
                                {airportID} - {data.city}, {data.country}
                            </option>
                        ))}
                    </select>

                    <select name="airplane_used" required>
                        <option selected disabled value="">
                            Select Airplane...
                        </option>

                        {Object.entries(dashboardData.airplanes_available).map(([airplaneID, data]) => (
                            <option key={airplaneID} value={airplaneID}>
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

                    <InputField
                        label="Departure Time"
                        name="departure_time"
                        type="datetime-local"
                        required
                        min={dateNow()}
                    />

                    <InputField
                        label="Flight Hour"
                        name="flight_hour"
                        type="number"
                        required
                        min="0"
                    />

                    <InputField
                        label="Flight Minute"
                        name="flight_minute"
                        type="number"
                        min="0"
                        max="59"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white rounded-md"
                    >
                        Submit
                    </button>
                </form>

                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-2 right-2"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

function ModifyUser({ modifyUserSubmit, dashboardData }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div id="topbar" className="flex items-center justify-end p-4">
                <button
                    className="bg-blue-600 text-white p-2 rounded-md"
                    onClick={() => setOpen(true)}
                >
                    Modify User
                </button>
            </div>

            <div id="table" className="w-full">
                <div className="table-row table-heading">
                    <div className="table-cell">Name</div>
                    <div className="table-cell">Email</div>
                    <div className="table-cell">Role</div>
                    <div className="table-cell"></div>
                </div>

                {dashboardData.users.map((user, i) => (
                    <div key={i} className="table-row">
                        <div className="table-cell">{user.name}</div>
                        <div className="table-cell">{user.email}</div>
                        <div className="table-cell">{user.permissions}</div>

                        <div className="table-cell">
                            <button className="flex justify-center items-center text-white bg-blue-500 p-2 rounded-md">
                                <span className="material-symbols-outlined">edit</span>
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`fixed inset-0 bg-black/50 z-10 ${
                    open ? "block" : "hidden"
                }`}
            ></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}
            >
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">
                    Modify User
                </h1>

                <form onSubmit={modifyUserSubmit} className="grid grid-cols-5 gap-3">
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
                        <option value="" disabled selected>
                            Select a field...
                        </option>

                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                        <option value="password">Password</option>
                        <option value="permissions">Permissions</option>
                    </select>

                    <InputField
                        label="Value"
                        name="value"
                        type="text"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-md"
                    >
                        Submit
                    </button>
                </form>

                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-2 right-2"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}
export default AdminPanel;
