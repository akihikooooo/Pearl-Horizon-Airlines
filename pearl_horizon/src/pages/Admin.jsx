// import "./stylesheets/account.css";
import "./stylesheets/admin.css";
import { InputField, SelectField } from "../components/InputField";
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

    // function newAirplaneSubmit(e) {
    //     e.preventDefault();
    //     const form = new FormData(e.target);

    //     for (const [_key, value] of form.entries()) {
    //         if (!value || (typeof value === "string" && value.trim() === "")) {
    //             return false;
    //         }
    //     }
    //     axios
    //         .post(`${apiUrl}/api/admin/add/airplane`, Object.fromEntries(form.entries()))
    //         .then(() => {
    //             e.target.reset();
    //             toast("Success");
    //             refreshData();
    //         })
    //         .catch((error) => {
    //             toast("Something went wrong, Check Console");
    //             console.log(error);
    //         });
    // }
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
    function modifyUserSubmit(e, email) {
        e.preventDefault();
        const form = new FormData(e.target);
        console.log(email);
        form.append("user", email);
        for (const [_key, value] of form.entries()) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return false;
            }
        }
        console.log(form);
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
    console.log(dashboardData);
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
                    {["Dashboard", "Manage Airports", "Booking Approval", "Manage Flight", "Manage Users", "Reviews"].map((item) => (
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
                    {page === "Manage Airports" && <ManageAirport newAirportSubmit={newAirportSubmit} airports={dashboardData.airports_available} refresh={refreshData} />}
                    {page === "Booking Approval" && <BookAppr bookings={dashboardData.booking_pending} refresh={refreshData} />}
                    {page === "Manage Flight" && <AddFlight newFlightSubmit={newFlightSubmit} dashboardData={dashboardData} dateNow={dateNow} refresh={refreshData} />}
                    {page === "Manage Users" && <ModifyUser modifyUserSubmit={modifyUserSubmit} dashboardData={dashboardData} />}
                    {page === "Reviews" && <ReviewStats reviews={dashboardData.reviews} />}
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

function ManageAirport({ newAirportSubmit, airports, refresh }) {
    const [open, setOpen] = useState(false);
    function deleteAirport(airport_id) {
        axios
            .delete(`${apiUrl}/api/admin/delete/airport/${airport_id}`).then(() => {
                toast("Airport deleted");
                refresh();
            }).catch((e) => {
                if (e.response.status === 409) {
                    toast("Cannot delete airport with existing flights  ");
                } else {
                    toast("Something went wrong");
                }});
    }
    return (
        <div>
            <div id="topbar" className="flex items-center justify-end p-4">
                <button className="bg-green-600 text-white p-2 rounded-md" onClick={() => setOpen(true)}>
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
                {Object.entries(airports).map(([airportID, data], i) => (
                    <div key={i} className="table-row">
                        <div className="table-cell">{airportID}</div>
                        <div className="table-cell">{data.country}</div>
                        <div className="table-cell">{data.city}</div>
                        <div className="table-cell">
                            <button className="flex justify-center items-center text-white bg-red-500 p-2 rounded-md" onClick={() => deleteAirport(airportID)}>
                                <span className="material-symbols-outlined">delete</span>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`fixed inset-0 bg-black/50 z-10 ${open ? "block" : "hidden"}`}></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}>
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">Add Airport</h1>

                <form
                    onSubmit={(e) => {
                        if (newAirportSubmit(e)) setOpen(false);
                    }}
                    className="grid grid-cols-5 gap-3">
                    <InputField label="Airport ID" name="airport_id" required placeholder="MNL" pattern="[A-Z]{3}" />
                    <InputField label="Country" name="country" required placeholder="Philippines" />
                    <InputField label="City" name="city" required placeholder="Manila" />
                    <button type="submit" className="bg-green-600 text-white rounded-md">
                        Submit
                    </button>
                </form>

                <button onClick={() => setOpen(false)} className="absolute top-2 right-2">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

function AddFlight({ newFlightSubmit, dashboardData, dateNow, refresh }) {
    const [open, setOpen] = useState(false);
    function deleteFlight(flight_id) {
        axios
            .delete(`${apiUrl}/api/admin/delete/flight/${flight_id}`)
            .then(() => {
                toast("Flight deleted");
                refresh();
            }).catch((e) => {
                if (e.response.status === 409) {
                    toast("Cannot delete flight with existing bookings");
                } else {
                    toast("Something went wrong");
                }

            });
    }
    return (
        <div>
            <div id="topbar" className="flex items-center justify-end p-4">
                <button className="bg-green-600 text-white p-2 rounded-md" onClick={() => setOpen(true)}>
                    Add Flight
                </button>
            </div>

            <div id="table" className="w-full">
                <div className="table-row table-heading">
                    <div className="table-cell">Flight ID</div>
                    <div className="table-cell">Origin</div>
                    <div className="table-cell">Destination</div>
                    <div className="table-cell">Airplane</div>
                    <div className="table-cell">Route</div>
                    <div className="table-cell">Departure</div>
                    <div className="table-cell"></div>
                </div>

                {dashboardData.flights?.map((flight, i) => (
                    <div key={i} className="table-row">
                        <div className="table-cell">{flight.flight_id}</div>
                        <div className="table-cell">{flight.origin_airport_id}</div>
                        <div className="table-cell">{flight.destination_airport_id}</div>
                        <div className="table-cell">{flight.airplane_id}</div>
                        <div className="table-cell">{flight.route}</div>
                        <div className="table-cell">
                            {(() => {
                                console.log(new Date(flight.departure_timestamp * 1000).toLocaleString());
                                return new Date(flight.departure_timestamp * 1000).toLocaleString();
                            })()}
                        </div>

                        <div className="table-cell">
                            <button className="flex justify-center items-center text-white bg-red-500 p-2 rounded-md" onClick={() => deleteFlight(flight.flight_id)}>
                                <span className="material-symbols-outlined">delete</span>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`fixed inset-0 bg-black/50 z-10 ${open ? "block" : "hidden"}`}></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}>
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">Add Flight</h1>

                <form onSubmit={newFlightSubmit} className="grid grid-cols-5 gap-3">
                    <InputField label="Flight ID" name="flight_id" required pattern="PH[0-9]{4}" placeholder="PH0000" />

                    <SelectField name="origin_airport" label="Origin" required>
                        <option value="" disabled selected>
                            Select an Airport...
                        </option>

                        {Object.entries(dashboardData.airports_available).map(([airportID, data]) => (
                            <option key={airportID} value={airportID}>
                                {airportID} - {data.city}, {data.country}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField name="destination_airport" label="Destination" required>
                        <option value="" disabled selected>
                            Select an Airport...
                        </option>

                        {Object.entries(dashboardData.airports_available).map(([airportID, data]) => (
                            <option key={airportID} value={airportID}>
                                {airportID} - {data.city}, {data.country}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField name="airplane_used" label="Airplane" required>
                        <option selected disabled value="">
                            Select Airplane...
                        </option>

                        {Object.entries(dashboardData.airplanes_available).map(([airplaneID, data]) => (
                            <option key={airplaneID} value={airplaneID}>
                                {data.model} - {data.seats} pax.
                            </option>
                        ))}
                    </SelectField>

                    <SelectField name="route_type" label="Route" required>
                        <option disabled selected value="">
                            Select Route Type...
                        </option>

                        <option value="oneway">One Way</option>
                        <option value="roundtrip">Round Trip</option>
                    </SelectField>

                    <InputField label="Departure Time" name="departure_time" type="datetime-local" required min={dateNow()} />

                    <InputField label="Flight Hour" name="flight_hour" type="number" required min="0" />

                    <InputField label="Flight Minute" name="flight_minute" type="number" min="0" max="59" required />

                    <button type="submit" className="bg-blue-600 text-white rounded-md">
                        Submit
                    </button>
                </form>

                <button onClick={() => setOpen(false)} className="absolute top-2 right-2">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

function BookAppr({ bookings, refresh }) {
    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState({});
    function getPaymentDetails(passenger) {
        axios.get(`${apiUrl}/api/admin/payment/${passenger.booking_id}`).then((res) => {
            console.log(res.data);
            setSelectedPayment(res.data);
        });
    }
    function setPaymentStatus(booking_id, paid) {
        axios.patch(`${apiUrl}/api/admin/payment/status`, { booking_id, paid: paid ? 1 : -1 }).then(() => {
            toast("Payment status updated");
            refresh();
        });
    }
    return (
        <div>
            <div id="table" className="w-full table-fixed">
                <div className="table-row table-heading">
                    <div className="table-cell w-1/5">Name</div>
                    <div className="table-cell w-1/5">Flight ID</div>
                    <div className="table-cell w-1/5">Origin - Destination</div>
                    <div className="table-cell w-1/5">Amount</div>
                    <div className="table-cell w-1/5">Receipt</div>
                </div>
                {bookings.map((passenger, i) => (
                    <>
                        <div key={i} className="table-row">
                            <div className="table-cell wrap-break-word w-1/5">{passenger.name}</div>
                            <div className="table-cell wrap-break-word w-1/5">{passenger.flight_id}</div>
                            <div className="table-cell wrap-break-word w-1/5">{passenger.route}</div>
                            <div className="table-cell wrap-break-word w-1/5">{passenger.amount_due}</div>
                            <div className="table-cell wrap-break-word w-1/5">
                                {" "}
                                <button
                                    className="flex justify-center items-center text-white bg-green-500 p-2 rounded-md"
                                    onClick={() => {
                                        getPaymentDetails(passenger);
                                        setOpenDetails(true);
                                    }}>
                                    <span className="material-symbols-outlined">check</span>
                                    Details
                                </button>
                            </div>

                            <div className="table-cell ">
                                <button
                                    className="flex justify-center items-center text-white bg-green-500 p-2 rounded-md"
                                    onClick={() => setPaymentStatus(passenger.booking_id, true)}>
                                    <span className="material-symbols-outlined">check</span>
                                    Approve
                                </button>
                                <button
                                    className="flex justify-center items-center text-white bg-red-500 p-2 rounded-md"
                                    onClick={() => setPaymentStatus(passenger.booking_id, false)}>
                                    <span className="material-symbols-outlined">close</span>
                                    Reject
                                </button>
                            </div>
                        </div>
                        <div className={`fixed inset-0 bg-black/5 z-10 ${openDetails ? "block" : "hidden"}`}></div>

                        <div
                            className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                                openDetails ? "block" : "hidden"
                            }`}>
                            <h1 className="text-2xl font-bold text-horizon-deep mb-4">Payment Details</h1>

                            <div>
                                <p>Selected Mode: {selectedPayment.payment_mode}</p>
                                <p>Amount Paid: {passenger.amount_due} PHP </p>
                                {selectedPayment.payment_mode == "receipt" ? (
                                    <img src={selectedPayment.receipt_image} alt="Receipt" />
                                ) : (
                                    <p>Card Details: {selectedPayment.last_four_digits}</p>
                                )}
                            </div>

                            <button onClick={() => setOpenDetails(false)} className="absolute top-2 right-2">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </>
                ))}
            </div>

            <div className={`fixed inset-0 bg-black/50 z-10 ${open ? "block" : "hidden"}`}></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}>
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">Modify User</h1>

                <form onSubmit="" className="grid grid-cols-5 gap-3">
                    <button type="submit" className="bg-blue-600 text-white rounded-md">
                        Submit
                    </button>
                </form>

                <button onClick={() => setOpen(false)} className="absolute top-2 right-2">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

function ModifyUser({ modifyUserSubmit, dashboardData }) {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    return (
        <div>
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
                            <button
                                className="flex justify-center items-center text-white bg-blue-500 p-2 rounded-md"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setOpen(true);
                                }}>
                                <span className="material-symbols-outlined">edit</span>
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`fixed inset-0 bg-black/50 z-10 ${open ? "block" : "hidden"}`}></div>

            <div
                className={`fixed top-1/2 left-1/2 w-8/12 bg-white rounded-xl shadow-xl p-6 z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                    open ? "block" : "hidden"
                }`}>
                <h1 className="text-2xl font-bold text-horizon-deep mb-4">Modify {selectedUser.email}</h1>

                <form onSubmit={(e) => modifyUserSubmit(e, selectedUser.email)} className="flex gap-3">
                    <SelectField name="field" label="Field">
                        <option value="" disabled selected>
                            Select a field...
                        </option>

                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                        <option value="password">Password</option>
                        <option value="permissions">Permissions</option>
                    </SelectField>

                    <InputField label="Value" name="value" type="text" required />

                    <button type="submit" className="bg-blue-600 text-white rounded-md w-64">
                        Submit
                    </button>
                </form>

                <button onClick={() => setOpen(false)} className="absolute top-2 right-2">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

function ReviewStats({ reviews }) {
    console.log(reviews);
    return (
        <div>
            <div id="table" className="w-full">
                <div className="table-row table-heading">
                    <div className="table-cell">Rating</div>
                    <div className="table-cell">Comments</div>
                </div>

                {reviews.map((review, i) => (
                    <div key={i} className="table-row">
                        <div className="table-cell">{review.rating}</div>
                        <div className="table-cell">{review.comments}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default AdminPanel;
