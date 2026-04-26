import { useMemo } from "react";
import { useState, useEffect } from "react";
import "./stylesheets/seatmap.css"

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

const SeatMap = () => {
  // Call generator if needed, for example:
  // const seatData = generator(['available', 'occupied', 'reserved']);
  const seatData = useMemo(
    () => generator(["available", "occupied"]),
    [],
  );
  const [SelectedSeat, setSelectedSeat] = useState(null);
  const [scrolled, setScrolled] = useState("false");

  useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
              <p>Seat Number: {SelectedSeat}</p>
              
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
