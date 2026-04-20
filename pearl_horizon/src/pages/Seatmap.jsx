import { useMemo } from "react";

function generator(status) {
  const seats = [];
  const cols = ["A", "B", "C", "H", "J", "K"];

  for (let i = 1; i <= 42; i++) {
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
    () => generator(["available", "occupied", "reserved"]),
    [],
  );

  return (
    <div className="pt-14">
    <div id="container" className="flex">
        <div className="w-1/2">
        
          </div>
        <div className="grid grid-cols-7 gap-4">
            {seatData.map((seat) =>
              seat.column === "H" ? (
                <>
                  <div className="text-center font-bold">{seat.row}</div>
                  <div
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
                  </div>
                </>
              ) : (
                <div
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
                </div>
              ),
            )}
          </div>
    </div>
    </div>
  );
};

export default SeatMap;
