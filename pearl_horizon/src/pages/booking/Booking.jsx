import { useReducer, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../index.css";
import "../stylesheets/booking.css";
import "../stylesheets/search.css";
import { InputField, SelectField } from "../../components/InputField.jsx";

const REQUIRED_FIELDS = [
    "title",
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
    "email",
    "phone_number",
    "emergency_contact_name",
    "emergency_phone_number",
];

const FIELD_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone_number: /^(\+639|09)\d{9}$/,
    emergency_phone_number: /^(\+639|09)\d{9}$/,
};

const validateField = (field, value) => {
    if (!value || value === "") return "This field is required.";
    if (FIELD_PATTERNS[field] && !FIELD_PATTERNS[field].test(value)) return "Invalid format.";
    return null;
};

const RenderPassenger = ({ index, data, handleChange, errors, onBlur }) => {
    const err = errors[index] || {};

    const handleBlur = (field, value) => {
        onBlur({ passenger: index, field, value });
    };

    return (
        <div id="passenger-cont" className="border rounded-md w-9/12 mx-2 my-4 p-2">
            <div id="passenger-header">
                <p className="flex items-center font-bold">Passenger {index + 1}</p>
            </div>
            <div id="passenger-details">
                <div id="name" className="flex gap-2 md:items-center flex-col md:flex-row">
                    <div id="title" className="name">
                        <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">Title</label>
                        <SelectField
                            value={data.title}
                            onChange={(e) => handleChange({ passenger: index, field: "title", value: e.target.value })}
                            onBlur={(e) => handleBlur("title", e.target.value)}
                            required>
                            <option value="" disabled>
                                -Select your title-
                            </option>
                            <option value="Mr">Mr.</option>
                            <option value="Ms">Ms.</option>
                            <option value="Mrs">Mrs.</option>
                        </SelectField>
                        {err.title && <p className="text-red-500 text-xs mt-1">{err.title}</p>}
                    </div>
                    <div>
                        <InputField
                            label="First Name"
                            placeholder="Juan"
                            type="text"
                            required
                            value={data.first_name}
                            error={!!err.first_name}
                            onChange={(e) => handleChange({ passenger: index, field: "first_name", value: e.target.value })}
                            onBlur={(e) => handleBlur("first_name", e.target.value)}
                        />
                        {err.first_name && <p className="text-red-500 text-xs mt-1">{err.first_name}</p>}
                    </div>
                    <div>
                        <InputField
                            label="Last Name"
                            placeholder="Dela Cruz"
                            type="text"
                            required
                            value={data.last_name}
                            error={!!err.last_name}
                            onChange={(e) => handleChange({ passenger: index, field: "last_name", value: e.target.value })}
                            onBlur={(e) => handleBlur("last_name", e.target.value)}
                        />
                        {err.last_name && <p className="text-red-500 text-xs mt-1">{err.last_name}</p>}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex gap-2">
                        {["Male", "Female"].map((gender) => (
                            <button
                                key={gender}
                                className={`flex justify-center items-center gap-1 font-medium ${data.gender === gender ? "text-horizon" : ""}`}
                                onClick={() => handleChange({ passenger: index, field: "gender", value: gender })}>
                                <div className={`h-3 w-3 border rounded-full ${data.gender === gender ? "bg-horizon border-transparent" : ""}`} />
                                {gender}
                            </button>
                        ))}
                        {err.gender && <p className="text-red-500 text-xs">{err.gender}</p>}
                    </div>
                    <div>
                        <InputField
                            label="Date of Birth"
                            type="date"
                            value={data.date_of_birth}
                            required
                            error={!!err.date_of_birth}
                            onChange={(e) => handleChange({ passenger: index, field: "date_of_birth", value: e.target.value })}
                            onBlur={(e) => handleBlur("date_of_birth", e.target.value)}
                        />
                        {err.date_of_birth && <p className="text-red-500 text-xs mt-1">{err.date_of_birth}</p>}
                    </div>
                </div>
            </div>
            <div id="contact-details">
                <p className="flex items-center font-medium">Contact Information</p>
                <div className="flex gap-2 md:items-center flex-col md:flex-row">
                    <div>
                        <InputField
                            label="Email"
                            placeholder="juandelacruz@email.com"
                            type="email"
                            required
                            value={data.email}
                            error={!!err.email}
                            onChange={(e) => handleChange({ passenger: index, field: "email", value: e.target.value })}
                            onBlur={(e) => handleBlur("email", e.target.value)}
                        />
                        {err.email && <p className="text-red-500 text-xs mt-1">{err.email}</p>}
                    </div>
                    <div>
                        <InputField
                            label="Phone Number"
                            placeholder="+63 912 345 6789"
                            type="tel"
                            required
                            value={data.phone_number}
                            error={!!err.phone_number}
                            onChange={(e) => handleChange({ passenger: index, field: "phone_number", value: e.target.value })}
                            onBlur={(e) => handleBlur("phone_number", e.target.value)}
                        />
                        {err.phone_number && <p className="text-red-500 text-xs mt-1">{err.phone_number}</p>}
                    </div>
                </div>
            </div>
            <div id="emergency-details">
                <p className="flex items-center font-medium">Emergency Contact Information</p>
                <div className="flex gap-2 md:items-center flex-col md:flex-row">
                    <div>
                        <InputField
                            label="Emergency Contact Name"
                            placeholder="Marcelo Aguncillo"
                            type="text"
                            required
                            value={data.emergency_contact_name}
                            error={!!err.emergency_contact_name}
                            onChange={(e) => handleChange({ passenger: index, field: "emergency_contact_name", value: e.target.value })}
                            onBlur={(e) => handleBlur("emergency_contact_name", e.target.value)}
                        />
                        {err.emergency_contact_name && <p className="text-red-500 text-xs mt-1">{err.emergency_contact_name}</p>}
                    </div>
                    <div>
                        <InputField
                            label="Phone Number"
                            placeholder="+63 912 345 6789"
                            type="tel"
                            required
                            value={data.emergency_phone_number}
                            error={!!err.emergency_phone_number}
                            onChange={(e) => handleChange({ passenger: index, field: "emergency_phone_number", value: e.target.value })}
                            onBlur={(e) => handleBlur("emergency_phone_number", e.target.value)}
                        />
                        {err.emergency_phone_number && <p className="text-red-500 text-xs mt-1">{err.emergency_phone_number}</p>}
                    </div>
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
        (state, action) => state.map((passenger, index) => (index === action.passenger ? { ...passenger, [action.field]: action.value } : passenger)),
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

    const [errors, setErrors] = useState(Array.from({ length: passengerCount }, () => ({})));

    const handleBlur = ({ passenger, field, value }) => {
        const error = validateField(field, value);
        setErrors((prev) => prev.map((errs, i) => (i === passenger ? { ...errs, [field]: error } : errs)));
    };

    const handleSubmit = () => {
        // Validate all required fields across all passengers
        const newErrors = passengers.map((passenger) => {
            const passengerErrors = {};
            REQUIRED_FIELDS.forEach((field) => {
                const error = validateField(field, passenger[field]);
                if (error) passengerErrors[field] = error;
            });
            return passengerErrors;
        });

        setErrors(newErrors);

        const hasErrors = newErrors.some((errs) => Object.keys(errs).length > 0);
        console.log(newErrors);
        if (hasErrors) return;

        navigate("/booking/seatmap", {
            state: {
                flight_id: searchParams.get("flightID"),
                route: searchParams.get("route"),
                passengers,
            },
        });
    };
    const hasAnyError = errors.some((errs) => Object.values(errs).some(Boolean));
    const handleChange = ({ passenger, field, value }) => {
        updatePassenger({ passenger, field, value });
        // Clear error for this field as soon as user starts typing
        setErrors((prev) => prev.map((errs, i) => (i === passenger ? { ...errs, [field]: null } : errs)));
    };
    const isSubmitDisabled = hasAnyError;
    return (
        <div id="cont" className="pt-14">
            <title>Booking</title>
            <div id="header" className="md:px-20 py-2 md:py-10">
                <h1 className="md:text-4xl text-horizon font-semibold flex items-center justify-center md:tracking-wider">Booking Information</h1>
            </div>
            <div id="render" className="flex flex-col justify-center items-center">
                {passengers.map((passenger, i) => (
                    <RenderPassenger
                        key={i}
                        index={i}
                        data={passenger}
                        handleChange={handleChange} // was: updatePassenger
                        errors={errors}
                        onBlur={handleBlur}
                    />
                ))}
            </div>
            <button onClick={handleSubmit} disabled={isSubmitDisabled} className={`bg-horizon hover:bg-horizon-hover text-white font-bold py-2 px-4 rounded ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                Submit
            </button>
        </div>
    );
}

export default Booking;
