import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import "./stylesheets/seatmap.css";
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

const Infos = ({ passengerID, name, seat }) => {
    return (
        <>
            <div id="passenger-info" className="bg-horizon max-w-11/12 p-4 rounded-r-full">
                <p className="text-white text-lg font-medium">Passenger Name: {name}</p>
                <p className="text-white">Passenger ID: {passengerID}</p>
                <p className="text-white">Selected Seat: {seat ? seat : "None"}</p>
                {/* <p className="text-white">Passenger ID: {selectedPassengerID}</p> */}
            </div>
        </>
    );
};

const SeatMap = () => {
    const { state } = useLocation();
    console.log(state)
    const [takenSeats, setTakenSeats] = useState([]);
    const [seatData, updateSeatData] = useState(generator(takenSeats));
    const [selectedPassenger, setSelectedPassenger] = useState(0);
    const [loading, setLoading] = useState(true);
    const [passengers, updatePassenger] = useReducer((state, action) => {
        // expects {passenger: num, field: str, value: value}
        // TODO: sanity checking
        return state.map((passenger, index) => (index === action.passenger ? { ...passenger, [action.field]: action.value } : passenger));
    }, state.passengers);

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
        <div className="pt-14">
            <div id="header"></div>
            <div id="container" className="flex flex-col md:flex-row">
                {passengers.map((passenger, i) => (
                    <div
                        id="informations"
                        className="sticky md:relative top-16 md:top-0 md:w-1/2 flex justify-start items-center flex-col bg-horizon-tint">
                        <div id="header">
                            <p className="text-2xl font-bold text-horizon">
                                Passenger {i + 1}: {passenger.first_name} {passenger.last_name}
                            </p>
                        </div>
                        <div id="add-ons" className="flex flex-col">
                            <div>
                                <p>Seat Number: {passenger.selected_seat}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="grid grid-cols-12 gap-2 border-2 border-horizon-deep p-4 md:mr-2">
                    {seatData.map((seat) => (
                        <>
                            {["H", "D"].includes(seat.column) ? <div className="text-center font-bold">{seat.row}</div> : <></>}
                            <button
                                onClick={() => {
                                    updatePassenger({ passenger: selectedPassenger, field: "selected_seat", value: seat.id });
                                }}
                                key={seat.id}
                                className={`p-4 border rounded flex justify-center items-center ${seat.id == passengers[selectedPassenger].selected_seat ? "bg-yellow-200" : seat.status === "available" ? "bg-green-200" : "bg-red-200"} seat-buttons`}
                                disabled={seat.status === "occupied" || seat.id == passengers[selectedPassenger].selected_seat}>
                                {seat.id}
                            </button>
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
