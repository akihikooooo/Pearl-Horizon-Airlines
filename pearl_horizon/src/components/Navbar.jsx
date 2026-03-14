import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`flex items-center h-16 px-8 ${scrolled ? "scrolled" : ""}`}
    >
      <div id="logo">
        <p>Pearl Horizon Airlines</p>
      </div>
      <ul className={`hidden lg:flex gap-4 ml-auto  `}>
        {["Home", "Book a Flight", "About Us", "Contact"].map((item) => (
          <NavLink
            to={item === "Home" ? "/" : item === "Book a Flight" ? "/booking" : item === "About Us" ? "/about" : "/contact"}
            key={`${item === "Book a Flight" ? "book" : item.toLowerCase()}`}
            className={`cursor-pointer hover:text-blue-500 transition-colors duration-300 ${scrolled ? "text-gray-700" : "text-gray-900"}`}>
            {item}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}
export default Navbar;
