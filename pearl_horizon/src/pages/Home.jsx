import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import req from "../assets/requirements.jpg";
import Card from "../components/Card";

const Home =  () => {
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
          <h1 className="font-extrabold text-2xl text-left w-full mb-4">
            Book a Flight
          </h1>
          {/* Form */}
          <form className="flex flex-col justify-center gap-4 w-full h-full">
            <div id="radios" className="w-full flex">
              <input
                type="radio"
                id="oneway"
                name="trip"
                value="oneway"
                className="hidden peer/oneway"
              />
              <label
                htmlFor="oneway"
                className="border p-2 mr-2 rounded cursor-pointer peer-checked/oneway:bg-blue-500 peer-checked/oneway:text-white"
              >
                One Way
              </label>
              <input
                type="radio"
                id="roundtrip"
                name="trip"
                value="roundtrip"
                className="hidden peer/roundtrip"
              />
              <label
                htmlFor="roundtrip"
                className="border p-2 rounded cursor-pointer peer-checked/roundtrip:bg-blue-500 peer-checked/roundtrip:text-white"
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
      <div id="requirements" className="flex justify-center items-center gap-8 p-8 w-full">
        <img src={req} alt="requirements" className="w-2/5" />
        <div id="req-text" className="flex flex-col w-1/2">
          <h1 className="font-extrabold text-2xl">Travel Requirements</h1>
          <p className="text-gray-600 w-4/6">
            Be ready for your trip—check the latest guidelines, documents, and health protocols before you fly.
          </p>
          <NavLink to="requirements" className=" p-2 w-1/2 font-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">
            Check Travel Requirements
          </NavLink>
        </div>
      </div>
      <div id="cards-cont" className="p-8">
        <h1 className="font-extrabold text-2xl">Places to go to!</h1>
        <div id="places" className="flex justify-center items-center gap-10">
          {["Pampanga", "Cebu", "Baguio"].map((place)=> (
            <Card title={place} description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." image={place}/>
          ))
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
