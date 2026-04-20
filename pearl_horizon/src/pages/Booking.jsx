import { useState } from "react";
import "../index.css";
import banner from "../assets/booking_banner.jpg";

function Booking() {
  const [passenger, setPassenger] = useState(1);
  return (
    <>
      <div id="header" className="pt-14">
        <div id="bg-cont" className="h-56 overflow-hidden relative">
          <img src={banner} className="w-full -translate-y-24" />
          <div className="absolute inset-0 flex items-end p-6">
            <p className="text-white text-3xl font-bold">Booking</p>
          </div>
        </div>
      </div>
      <div id="main-booking" className="p-6">
        <div id="upper" className="flex flex-col lg:flex-row gap-6">
          <input placeholder="From" type="text" />
          <input placeholder="To" type="text" />
          <input placeholder="Check-in Date" type="date" />
          <input placeholder="Check-out Date" type="date" />
          <div className="flex items-center gap-2">
            <label htmlFor="passenger">Passengers</label>
            <div id="add-passenger" className="flex items-center gap-2">
              <button
                onClick={() => setPassenger(passenger - 1)}
                disabled={passenger <= 1}
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                -
              </button>
              <span>{passenger}</span>
              <button
                onClick={() => setPassenger(passenger + 1)}
                className="px-2 py-1 bg-gray-300 rounded"
              >
                +
              </button>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </div>
        <div id="lower" className="flex flex-row flex-wrap gap-6 mt-6">

        </div>
      </div>
    </>
  );
}
export default Booking;
