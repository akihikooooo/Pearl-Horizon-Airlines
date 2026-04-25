import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import "./stylesheets/Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`flex items-center justify-between h-16 px-8 ${scrolled ? "scrolled" : ""} overflow-hidden`}
    >
     <span>
      <NavLink to="/" className="text-base md:text-xl font-bold text-black">
        Pearl <span className="text-horizon">Horizon</span> Airline
      </NavLink>
     </span>
     
     <span>
      <ul className="hidden md:flex items-center">
        {["Home", "Booking", "About", "Contact"].map((item) => (
          <li key={item} className="inline-block ml-6">
            <NavLink to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`} className={({ isActive }) => (isActive ? "text-horizon" : "text-black")}>
              {item}
            </NavLink>
          </li>
        ))}
        <span id="account" className="flex items-center border border-horizon rounded-sm px-3 py-1 ml-6 cursor-pointer hover:bg-horizon hover:text-white transition-colors duration-300">
          <span className="material-symbols-outlined mr-1">
            person
          </span>
          <NavLink to="/login">Log In</NavLink>
        </span>
      </ul>
     </span>
    </nav>
  );
}
export default Navbar;
