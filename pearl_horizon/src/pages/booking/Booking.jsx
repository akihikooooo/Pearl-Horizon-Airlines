import { useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../index.css";
import "../stylesheets/booking.css";
import "../stylesheets/search.css";
import InputField from "../../components/InputField.jsx";

const RenderPassenger = ({ index, data, onChange }) => {
    return (
        <div id="passenger-cont" className="border rounded-md w-9/12 mx-2 my-4 p-2">
            <div id="passenger-header">
                <p className="flex items-center font-bold">Passenger {index + 1}</p>
            </div>
            <div id="passenger-details">
                <div id="name" className="flex gap-2 md:items-center flex-col md:flex-row">
                    <div id="title" className="name">
                        <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">Title</label>
                        <select
                            value={data.title}
                            onChange={(e) => onChange({ passenger: index, field: "title", value: e.target.value })}
                            required
                            className="w-full md:text-sm bg-sky-white border border-sky-slate px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm">
                            <option value="" disabled>
                                -Select your title-
                            </option>
                            <option value="Mr">Mr.</option>
                            <option value="Ms">Ms.</option>
                            <option value="Mrs">Mrs.</option>
                        </select>
                    </div>
                    <InputField
                        label="First Name"
                        placeholder="Juan"
                        type="text"
                        className=""
                        required
                        value={data.first_name}
                        onChange={(e) => onChange({ passenger: index, field: "first_name", value: e.target.value })}
                    />
                    <InputField
                        label="Last Name"
                        placeholder="Dela Cruz"
                        type="text"
                        required
                        value={data.last_name}
                        onChange={(e) => onChange({ passenger: index, field: "last_name", value: e.target.value })}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex gap-2">
                        {["Male", "Female"].map((gender) => {
                            return (
                                <button
                                    className={`flex justify-center items-center gap-1 font-medium ${data.gender == gender ? "text-horizon" : ""}`}
                                    onClick={() => {
                                        onChange({ passenger: index, field: "gender", value: gender });
                                    }}>
                                    <div
                                        className={`h-3 w-3 border rounded-full ${data.gender == gender ? "bg-horizon border-transparent" : ""}`}></div>
                                    {gender}
                                </button>
                            );
                        })}
                    </div>
                    <div>
                        <InputField
                            label="Date of Birth"
                            type="date"
                            value={data.date_of_birth}
                            onChange={(e) => onChange({ passenger: index, field: "date_of_birth", value: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div id="contact-details">
                <p className="flex items-center font-medium"> Contact Information </p>
                <div className="flex gap-2 md:items-center flex-col md:flex-row">
                    <InputField
                        label="Email"
                        placeholder="juandelacruz@email.com"
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => onChange({ passenger: index, field: "email", value: e.target.value })}
                    />
                    <InputField
                        label="Phone Number"
                        placeholder="+63 912 345 6789"
                        type="tel"
                        required
                        value={data.phone_number}
                        pattern="^(\+639|09)\d{9}$"
                        onChange={(e) => onChange({ passenger: index, field: "phone_number", value: e.target.value })}
                    />
                </div>
            </div>
            <div id="emergency-details">
                <p className="flex items-center font-medium"> Emergency Contact Information </p>
                <div className="flex gap-2 md:items-center flex-col md:flex-row">
                    <InputField
                        label="Emergency Contact Name"
                        placeholder="Marcelo Aguncillo"
                        type="text"
                        required
                        value={data.emergency_contact_name}
                        onChange={(e) => onChange({ passenger: index, field: "emergency_contact_name", value: e.target.value })}
                    />
                    <InputField
                        label="Phone Number"
                        placeholder="+63 912 345 6789"
                        type="tel"
                        required
                        pattern="^(\+639|09)\d{9}$"
                        value={data.emergency_phone_number}
                        onChange={(e) => onChange({ passenger: index, field: "emergency_phone_number", value: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

function Booking() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passengerCount = parseInt(searchParams.get("passengers")) || 1;

    const [passengers, updatePassenger] = useReducer(
        (state, action) => {
            // expects {passenger: num, field: str, value: value}
            // TODO: sanity checking
            const ret = state.map((passenger, index) => (index === action.passenger ? { ...passenger, [action.field]: action.value } : passenger));
            return ret;
        },
        Array.from({ length: passengerCount }, () => ({
            title: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: null,
            date_of_birth: "",
            email: "",
            phone_number: "",
            emergency_contact_name: "",
            emergency_phone_number: "",
            selected_seat: "",
            meal_preference: null,
        })),
    );

    const handleSubmit = () => {
        navigate("/booking/seatmap", { state: { flight_id: searchParams.get("flightID"), route: searchParams.get("route"), passengers: passengers } });
    };

    return (
        <div id="cont" className="pt-14">
            <title>Booking</title>
            <div id="header" className="md:px-20 py-2 md:py-10">
                <h1 className="md:text-4xl text-horizon font-semibold flex items-center justify-center md:tracking-wider">Booking Information</h1>
            </div>
            <div id="render" className="flex flex-col justify-center items-center">
                {passengers.map((passenger, i) => (
                    <RenderPassenger key={i} index={i} data={passenger} onChange={updatePassenger} />
                ))}
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default Booking;
