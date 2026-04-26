import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import "./stylesheets/Navbar.css";
import { useAuth } from "../services/auth";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const {user, _logout}= useAuth();
  const userid = (user ? user.user_id : "Log in")
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
        {["Home", "Booking", "Contact"].map((item) => (
          <li key={item} className="inline-block ml-6">
            <NavLink to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`} className={({ isActive }) => (isActive ? "text-horizon" : "text-black")}>
              {item}
            </NavLink>
          </li>
        ))}
        <span className="material-symbols-outlined mr-1">
          person
        </span>
        <NavLink to="/accounts/login" id="account" className="flex items-center border border-horizon rounded-sm px-3 py-1 ml-6 cursor-pointer hover:bg-horizon hover:text-white transition-colors duration-300">{userid}</NavLink>
      </ul>
     </span>
    </nav>
  );
}
export default Navbar;
