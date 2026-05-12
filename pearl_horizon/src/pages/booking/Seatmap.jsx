import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import "../stylesheets/seatmap.css";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

function generator(seatsTaken) {
    const seats = [];
    const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    for (let i = 1; i <= 35; i++) {
        cols.forEach((col) => {
            const id = `${i}${col}`;
            seats.push({
                id: id,
                row: i,
                column: col,
                status: seatsTaken.includes(id) ? "occupied" : "available",
            });
        });
    }
    return seats;
}

const Infos = ({ passengerID, selectedPassenger, onSelect, name, seat, mealPreference, onClick }) => {
    const Meals = ["Sandwich", "Drink", "Snack"];
    return (
        <div className="flex flex-col gap-1">
            <button
                id="passenger-info"
                className={` p-4 rounded-r-lg ${selectedPassenger === passengerID ? "bg-horizon text-sky-white" : "bg-sky-cloud text-horizon-deep"}`}
                onClick={onSelect}>
                <p className=" text-lg font-medium">Passenger Name: {name}</p>
                {/* <p className="">Passenger ID: {passengerID}</p> */}
            </button>
            <div id="add-ons" className="bg-horizon-deep p-4">
                <p className="text-white text-lg font-medium">Selected Seat: {seat ? seat : "None"}</p>
                <p className="text-white text-lg font-medium">Meal Preferences</p>
                <div className="flex mt-2 justify-between w-full gap-2">
                    {Meals.map((option, i) => (
                        <button
                            key={i}
                            value={option}
                            className={`w-full ${mealPreference == option ? "bg-dusk-warm text-sky-white" : "bg-horizon-tint"}`}
                            onClick={onClick}>
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SeatMap = () => {
    const { state } = useLocation();
    const [takenSeats, setTakenSeats] = useState([]);
    const [seatData, updateSeatData] = useState(generator(takenSeats));
    const [selectedPassenger, setSelectedPassenger] = useState(0);
    const [loading, setLoading] = useState(true);
    const [passengers, updatePassenger] = useReducer((state, action) => {
        // expects {passenger: num, field: str, value: value}
        // TODO: sanity checking
        const newState = state.map((passenger, index) => (index === action.passenger ? { ...passenger, [action.field]: action.value } : passenger));
        return newState
    }, state.passengers);

    const onSubmit = () => {
        const passengerNoSeat = passengers.findIndex((passenger) => passenger.selected_seat === "");
        if (passengerNoSeat != -1) {
            alert(`Passenger ${passengerNoSeat+1} has no selected seats yet.`)
            // TODO: a better way to warn the user
        }
        axios.post(`${apiUrl}/api/book/entry`, {flight_id: state.flight_id, amount_due: 0, passengers: passengers}).then(() => alert("Successully booked. (btw this popup is still wip papalitan sya :3)"))
    };
    useEffect(() => {
        axios
            .get(`${apiUrl}/api/book/seats`, {
                params: {
                    flight_id: state.flight_id,
                },
            })
            .then((res) => {
                setTakenSeats(res.data.taken_seats);
                updateSeatData(generator(res.data.taken_seats));
                setLoading(false);
            });
    }, [state.flight_id]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="pt-16">
            <div id="header"></div>
            <div id="container" className="flex flex-col md:flex-row">
                <div className="flex flex-col w-1/2 gap-2 pr-2">
                    {passengers.map((passenger, i) => (
                        <Infos
                            key={i}
                            passengerID={i}
                            selectedPassenger={selectedPassenger}
                            name={`${passenger.first_name} ${passenger.last_name}`}
                            seat={passenger.selected_seat}
                            onSelect={() => setSelectedPassenger(i)}
                            mealPreference={passenger.meal_preference}
                            onClick={(e) => updatePassenger({passenger: i, field: "meal_preference", value: e.target.value})}
                        />
                    ))}

                    <button onClick={onSubmit} className="bg-horizon text-sky-white ml-2 p-4 rounded-lg">
                        Proceed to Summary
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-2 border-2 border-horizon-deep p-4 md:mr-2">
                    {seatData.map((seat, i) => {
                        let seat_color = "bg-green-200";
                        const seatSelectedByOthers = passengers.some((passenger) => passenger.selected_seat === seat.id);
                        if (seat.id == passengers[selectedPassenger].selected_seat) {
                            seat_color = "bg-yellow-400";
                        } else if (seatSelectedByOthers) {
                            seat_color = "bg-yellow-200";
                        } else if (seat.status == "occupied") {
                            seat_color = "bg-red-200";
                        }

                        return (
                            <>
                                {["H", "D"].includes(seat.column) ? <div className="text-center font-bold">{seat.row}</div> : <></>}
                                <button
                                    onClick={() => {
                                        updatePassenger({ passenger: selectedPassenger, field: "selected_seat", value: seat.id });
                                    }}
                                    key={i}
                                    className={`p-4 border rounded flex justify-center items-center ${seat_color} seat-buttons`}
                                    disabled={
                                        seat.status === "occupied" || seat.id == passengers[selectedPassenger].selected_seat || seatSelectedByOthers
                                    }>
                                    {seat.id}
                                </button>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
