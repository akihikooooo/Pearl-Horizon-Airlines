import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Card from "../components/Card";

const DESTINATIONS = [
  { city: "Pampanga", badge: "DOMESTIC", price: "₱1,299", desc: "The Culinary Capital of the Philippines." },
  { city: "Cebu",     badge: "POPULAR",  price: "₱1,799", desc: "Island paradise with pristine beaches." },
  { city: "Baguio",   badge: "HIGHLAND", price: "₱999",   desc: "Cool air, pine trees, and calm mornings." },
];
const STATS = [
  { n: "48+",   l: "Destinations"    },
  { n: "2.4M", l: "Passengers Flown" },
  { n: "99%",  l: "On-time Rate"    },
];
const STRIP = [
  "Free rebooking within 24h",
  "Real-time seat selection",
  "Priority check-in available",
  "24/7 support",
];

const Home = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneway");

  const handleSearch = (e) => { e.preventDefault(); navigate("/booking"); };

  return (
    <div id="home" className="bg-sky-white text-sky-night font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg,rgba(26,26,46,.82) 0%,rgba(26,26,46,.42) 52%,rgba(26,110,245,.18) 100%),
              url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')`,
          }}
        />

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 lg:px-12 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* headline */}
          <div>
            <p className="flex items-center gap-3 text-[#8DB8D4] text-[0.7rem] font-medium tracking-[0.2em] uppercase mb-5 before:block before:w-8 before:h-px before:bg-[#8DB8D4]">
              Pearl Horizon Airlines
            </p>
            <h1 className="font-serif text-[2.75rem] lg:text-[3.75rem] leading-[1.1] font-bold text-white mb-6">
              The sky is not<br />the limit.<br />
              <em style={{ fontStyle: 'italic' }} className="text-[#D4A97A]">It's the beginning.</em>
            </h1>
            <p className="text-white/65 font-light leading-relaxed max-w-sm mb-8">
              Discover the Philippines in comfort. From the highlands of Baguio
              to the shores of Cebu — every journey starts here.
            </p>
            <NavLink
              to="/booking"
              className="inline-flex items-center gap-2 bg-horizon text-white px-7 py-3 text-sm font-medium tracking-wide hover:bg-horizon-deep transition-colors"
            >
              Explore Destinations →
            </NavLink>
            <div className="flex gap-10 mt-12">
              {STATS.map(({ n, l }) => (
                <div key={l}>
                  <p className="font-serif text-[2rem] font-bold text-white leading-none">{n}</p>
                  <p className="text-[0.72rem] font-light text-white/45 tracking-widest mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* booking card */}
          <div className="bg-sky-white/95 backdrop-blur-xl border border-sky-cloud shadow-xl shadow-sky-night/20 p-8 rounded-sm">
            <h2 className="font-serif text-[1.3rem] font-semibold text-sky-night mb-6">Book a Flight</h2>

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
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="bg-sky-cloud border-y border-sky-slate/20 py-4 px-6 flex flex-wrap items-center justify-center gap-6 lg:gap-12">
        {STRIP.map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-[0.78rem] font-medium tracking-wide text-sky-slate">
            <span className="w-[5px] h-[5px] rounded-full bg-horizon shrink-0" />
            {item}
          </div>
        ))}
      </div>

      {/* ── REQUIREMENTS ── */}
      <section className="bg-sky-white">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div className="relative h-72 lg:h-80 hidden lg:block">
            <div className="absolute top-0 left-0 w-[260px] bg-sky-cloud border border-sky-slate/20 p-7 rounded-sm">
              <span className="text-3xl block mb-4">🪪</span>
              <h4 className="text-sm font-semibold text-sky-night mb-2">Valid ID Required</h4>
              <p className="text-xs text-sky-slate leading-relaxed">
                Government-issued photo ID or passport for all flights.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-[260px] bg-horizon-tint border border-horizon/20 p-7 rounded-sm">
              <span className="text-3xl block mb-4">📋</span>
              <h4 className="text-sm font-semibold text-sky-night mb-2">Health Protocols</h4>
              <p className="text-xs text-sky-slate leading-relaxed">
                Check the latest health and safety guidelines before travel.
              </p>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-3 text-horizon text-[0.7rem] font-semibold tracking-[0.2em] uppercase mb-4 before:block before:w-6 before:h-px before:bg-horizon">
              Before You Fly
            </p>
            <h2 className="font-serif text-[2.25rem] font-bold text-sky-night leading-tight mb-5">
              Travel Requirements
            </h2>
            <p className="text-sky-slate leading-relaxed mb-8">
              Be ready for your trip — check the latest guidelines, documents,
              and health protocols before you fly.
            </p>
            <NavLink
              to="/requirements"
              className="inline-flex items-center gap-2 border border-horizon text-horizon px-6 py-3 text-sm font-medium tracking-wide hover:bg-horizon hover:text-white transition-colors rounded-sm"
            >
              Check Travel Requirements →
            </NavLink>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="bg-sky-cloud px-6 lg:px-12 py-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="flex items-center gap-3 text-horizon text-[0.7rem] font-semibold tracking-[0.2em] uppercase mb-3 before:block before:w-6 before:h-px before:bg-horizon">
                Featured Routes
              </p>
              <h2 className="font-serif text-[2.25rem] font-bold text-sky-night">Places to go to</h2>
            </div>
            <NavLink to="/destinations" className="text-xs text-sky-slate tracking-wide hover:text-horizon transition-colors hidden lg:block font-medium">
              View all destinations →
            </NavLink>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DESTINATIONS.map(({ city, badge, price, desc }) => (
              <Card
                key={city} title={city} description={desc}
                image={city} badge={badge} price={price}
              />
            ))}
          </div>
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