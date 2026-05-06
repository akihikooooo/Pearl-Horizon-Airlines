import axios from "axios";
import { useEffect, useState, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../services/auth";
import "./stylesheets/seatmap.css"
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
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [takenSeats, setTakenSeats] = useState([]);
  const [seatData, updateSeatData] = useState(generator(takenSeats));
  const [selectedPassenger, setSelectedPassenger] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passengers, updatePassenger] = useReducer(
    (state, action) => {
      // action expects {"type": "update_seat", "passenger": pax, "seat": seatid}
      if (action.type == "update_seat") {
        return state.map((passenger, index) => (index === action.passenger ? { ...passenger, selected_seat: action.seat } : passenger));
      }
      return state;
    },
    [{ first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name, selected_seat: null }],
  );

  const selectSeat = (seatid) => {
    if (takenSeats.includes(seatid)) return;
    setSelectedSeat(seatid);
    updatePassenger({ type: "update_seat", passenger: selectedPassenger, seat: seatid });
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/book/seats`, {
        params: {
          flight_id: searchParams.get("flight_id"),
        },
      })
      .then((res) => {
        setTakenSeats(res.data.taken_seats);
        updateSeatData(generator(res.data.taken_seats));
        setLoading(false);
      });
  }, [searchParams]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-14">
      <div id="header">
      
      </div>
    <div id="container" className="flex flex-col md:flex-row">
        <div id="informations" className="sticky md:relative top-16 md:top-0 md:w-1/2 flex justify-start items-center flex-col bg-horizon-tint">
          <div id="header">
            <p className="text-2xl font-bold text-horizon">Passenger 1: Akihiko Tanaka</p>
          </div>
          <div id="add-ons" className="flex flex-col">
            <div>
              <p>Seat Number: {selectedSeat}</p>
            </div>
          </div>
          </div>
        <div className="grid grid-cols-12 gap-2 border-2 border-horizon-deep p-4 md:mr-2">
            {seatData.map((seat) =>
              seat.column === "H" || seat.column === "D"? (
                <>
                  <div className="text-center font-bold">{seat.row}</div>
                  <button
                    onClick={()=> {setSelectedSeat(seat.id)}}
                    key={seat.id}
                    className={`p-4 border rounded flex justify-center items-center ${
                      seat.status === "available"
                        ? "bg-green-200"
                        :  "bg-red-200"
                    } seat-buttons`} disabled={seat.status==="occupied"}
                  >
                    {seat.id}
                  </button>
                </>
              ) : (
                <button
                  onClick={()=> {setSelectedSeat(seat.id)}}
                  key={seat.id}
                  className={`p-4 flex justify-center items-center border rounded ${
                    seat.status === "available"
                      ? "bg-green-200"
                      : "bg-red-200"
                  } seat-buttons`}
                  disabled={seat.status==="occupied"}
                >
                  {seat.id}
                </button>
              ),
            )}
          </div>
    </div>
    </div>
  );
};

export default SeatMap;
