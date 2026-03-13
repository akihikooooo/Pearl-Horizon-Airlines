import React from "react";
import "../index.css";

const Home = () => {
  return (
    <div id="home">
      <div
        id="hero"
        className="flex flex-col pt-14  lg:flex-row items-center justify-between bg-blue-100"
      >
        {/* Carousel */}
        <div className="lg:w-1/2">Details Carousel</div>
        {/* Flight search form */}
        <div
          id="form"
          className="m-2 lg:w-1/2 flex flex-col items-center justify-center p-8"
        >
          <h1 className="font-extrabold text-2xl text-left w-full">
            Book a Flight
          </h1>
          <form className="flex flex-col justify-center gap-4 w-full h-full">
            <div id="radios" className="">
              <input
                type="radio"
                id="oneway"
                name="trip"
                value="oneway"
                className="hidden"
              />
              <label
                htmlFor="oneway"
                className="border p-2 rounded cursor-pointer"
              >
                One Way
              </label>
              <input
                type="radio"
                id="roundtrip"
                name="trip"
                value="roundtrip"
                className="hidden"
              />
              <label
                htmlFor="roundtrip"
                className="border p-2 rounded cursor-pointer"
              >
                Round Trip
              </label>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="From"
                className="border p-2 rounded w-1/2"
              />
              <input
                type="text"
                placeholder="To"
                className="border p-2 rounded w-1/2"
              />
            </div>
            <input type="date" className="border p-2 rounded" />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search Flights
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
