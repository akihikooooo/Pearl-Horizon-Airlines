import { useMemo } from "react";
import { useState } from "react";

// const [passengerCount, setPassengerCount] = useState(1);
// const [selectedSeat, setSelectedSeat] = useState("");
function generator(status) {
  const seats = [];
  const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  
  for (let i = 1; i <= 35; i++) {
    cols.forEach((col) => {
      seats.push({
        id: `${i}${col}`,
        row: i,
        column: col,
        status: status[Math.floor(Math.random() * status.length)],
      });
    });
  }
  return seats;
}

const Infos = ({passengerID}) => {
  return(
    <>
      <div id="passenger-info" className="bg-horizon max-w-11/12 p-4 rounded-r-full">
        <p className="text-white text-lg font-medium">Passenger Name: John Doe</p>
        <p className="text-white">Passenger ID: {passengerID}</p>
        <p className="text-white">Selected Seat: 1D</p>
        {/* <p className="text-white">Passenger ID: {selectedPassengerID}</p> */}
      </div>
    </>
  )
}

const SeatMap = () => {
  // Call generator if needed, for example:
  // const seatData = generator(['available', 'occupied', 'reserved']);
  const seatData = useMemo(
    () => generator(["available", "occupied", "reserved"]),
    [],
  );

  return (
    <div className="pt-14">
    <div id="container" className="flex">
        <div className="w-1/2 flex flex-col gap-4">
          {[...Array(passengerCount)].map((_, i) => {
            return (<Infos key={i} passengerID={i + 1} />);
          })}
          </div>
        <div className="grid grid-cols-12 gap-2 border-2 border-horizon-deep p-4 mr-2">
            {seatData.map((seat) =>
              seat.column === "H" || seat.column === "D"? (
                <>
                  <div className="text-center font-bold">{seat.row}</div>
                  <button
                    key={seat.id}
                    className={`p-4 border rounded flex justify-center items-center ${
                      seat.status === "available"
                        ? "bg-green-200"
                        : seat.status === "occupied"
                          ? "bg-red-200"
                          : "bg-yellow-200"
                    }`}
                  >
                    {seat.id}
                  </button>
                </>
              ) : (
                <button
                  key={seat.id}
                  className={`p-4 border rounded ${
                    seat.status === "available"
                      ? "bg-green-200"
                      : seat.status === "occupied"
                        ? "bg-red-200"
                        : "bg-yellow-200"
                  }`}
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
