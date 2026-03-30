import React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../index.css";
import "./stylesheets/Home.css";
// import req from "../assets/requirements.jpg";
import Card from "../components/Card";
import useBackend from "../backend/useBackend";

const Requirement =({ icon }) => {
  return(
    <div className="flex justify-center flex-col border border-red rounded-sm bg-sky-cloud w-1/2 p-2">
      <span className="material-symbols-outlined text-horizon" style={{ fontSize: "3rem" }}>
        {icon}
</span>
      <p className="text-xl mt-2">Valid ID</p>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate();
    const [tripType, setTripType] = useState("oneway"); 
    const handleSearch = (e) => { e.preventDefault(); navigate("/booking"); };
  return (
    <div id="container">
      <section id="hero" className="flex items-center justify-around pt-20 pb-16">
        <div className="w-4/12 flex items-start justify-center flex-col text-white p-10">
          <div id="hero-heading" className="flex items-center text-dusk-pale font-semibold tracking-[0.2em] uppercase mb-4">
            Pearl Horizon Airlines
          </div>
          <h1 className="text-6xl font-bold">The sky is not <br/> the limit. <br/>
            <span className="italic">It's the <span className="text-dusk-warm">beginning</span>. </span></h1>
          <p className="text-white/65 font-light leading-relaxed max-w-sm mt-6">
              Discover the Philippines in comfort. From the highlands of Baguio
              to the shores of Cebu — every journey starts here.
            </p>
        </div>
        <div className="w-4/12 bg-sky-cloud border border-sky-cloud shadow-xl shadow-sky-night/20 p-8 rounded-sm flex justify-center flex-col">
        <span className="text-2xl font-semibold">Book a Flight</span>
        <div className="flex border border-sky-cloud mb-6 rounded-sm overflow-hidden">
          {["oneway", "roundtrip"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTripType(type)}
                    className={`flex-1 py-2.5 text-[0.8rem] tracking-wide transition-colors font-medium
                      ${tripType === type
                        ? "bg-horizon text-white"
                        : "text-sky-slate hover:text-sky-night bg-transparent"
                      }`}
                  >
                    {type === "oneway" ? "One Way" : "Round Trip"}
                  </button>
                ))}
        </div>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <BookingField label="From" placeholder="Manila (MNL)" type="text" />
                <BookingField label="To"   placeholder="Cebu (CEB)"   type="text" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <BookingField label="Departure" type="date" />
                {tripType === "roundtrip" && (
                  <BookingField label="Return" type="date" />
                )}
              </div>
              <BookingField label="Passengers" type="number" placeholder="1" min="1" max="9" />
              <button
                type="submit"
                className="w-full bg-horizon text-white py-3.5 text-sm font-medium tracking-widest hover:bg-horizon-deep transition-colors mt-1"
              >
                Search Flights
              </button>
            </form>
        </div>
      </section>
      <section id="requirements" className="flex items-center justify-center flex-col py-16">
        <div className="w-5/12 text-center">
          <h2 className="text-3xl font-bold mb-6">Travel Requirements</h2>
          </div>
          <div className="w-5/12 flex items-center justify-center gap-6">
          <Requirement icon="id_card" />
          <Requirement icon="id_card" />
          <Requirement icon="id_card" />
          </div>
          </section>
    </div>
  );
};

const BookingField = ({ label, ...inputProps }) => (
  <div>
    <label className="block text-[0.65rem] font-semibold tracking-[0.15em] text-sky-slate uppercase mb-1.5">
      {label}
    </label>
    <input
      {...inputProps}
      className="w-full bg-sky-cloud border border-sky-slate/30 px-3.5 py-2.5 text-sky-night text-sm placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm"
    />
  </div>
);

export default Home;
