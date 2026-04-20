import React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../index.css";
import "./stylesheets/Home.css";
// import req from "../assets/requirements.jpg";
import Card from "../components/Card";

const Requirement =({ icon, title, description }) => {
  return(
    <div className="flex flex-col border border-red rounded-sm bg-sky-cloud flex-1">
      <div className="flex items-center justify-center gap-6 bg-horizon-deep py-2">
        <span className="material-symbols-outlined text-sky-cloud" style={{ fontSize: "3rem" }}>
          {icon}
        </span>
        <p className="text-xl text-sky-cloud">{title}</p>
      </div>
      <p className="text-horizon-deep text-lg mt-2 p-2">{description}</p>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate();
    const [tripType, setTripType] = useState("oneway"); 
    const handleSearch = (e) => { e.preventDefault(); navigate("/search"); };
  return (
    <div id="container">
      <section id="hero" className="flex items-center justify-around flex-col md:flex-row pt-20 pb-16">
        <div className="md:w-4/12 flex items-start justify-center flex-col text-white md:p-10">
          <div id="hero-heading" className="flex items-center text-dusk-pale font-semibold lg:tracking-[0.2em] uppercase mb-4">
            Pearl Horizon Airlines
          </div>
          <h1 className="md:text-2xl lg:text-6xl font-bold">The sky is not the limit. <br/>
            <span className="italic">It's the <span className="text-dusk-warm">beginning</span>. </span></h1>
          <p className="text-sky-cloud font-light leading-relaxed  text-sm md:text-lg lg:text-2xl max-w-sm mt-6">
              Discover the Philippines in comfort. From the highlands of Baguio
              to the shores of Cebu — every journey starts here.
            </p>
        </div>
        <div className="md:w-4/12 bg-sky-cloud border border-sky-cloud shadow-xl shadow-sky-night/20 m-2 p-4 md:p-8 rounded-sm flex justify-center flex-col">
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
      <section id="requirements" className="flex items-center justify-center flex-col p-8">
        <div className="w-5/12 text-center">
          <h2 className="text-3xl font-bold mb-6">Travel Requirements</h2>
          </div>
        <div className="px-4 flex items-stretch justify-center gap-6">
          <Requirement icon="id_card" 
                      title="Valid ID" 
                      description="A valid government-issued ID is required for all passengers." />
          <Requirement icon="health_and_safety" 
                      title="Health Certificate" 
                      description="A health certificate may be required for certain destinations." />
          </div>
          <div className="px-4 py-6 text-center">
            For more information on travel requirements, please visit the official website of the Philippine Department of Tourism or contact your local embassy.
            </div>
          </section>
    </div>
  );
};

const BookingField = ({ label, ...inputProps }) => (
  <div>
    <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">
      {label}
    </label>
    <input
      {...inputProps}
      className="md:text-sm w-full bg-sky-cloud border border-sky-slate px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm"
    />
  </div>
);

export default Home;
