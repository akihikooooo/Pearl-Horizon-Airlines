import React, { useState, useEffect } from "react";
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
        <li>Home</li>
        <li>Book a flight</li>
        <li>Contact Us</li>
      </ul>
    </nav>
  );
}
export default Navbar;
