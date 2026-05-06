import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import { useAuth } from "../services/auth";
import "./stylesheets/navbar.css";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user, authed } = useAuth();

    const accountText = authed ? user.first_name : "Log in";

    const taskbarItems = ["Home", "Contact"];
    if (authed) {
        taskbarItems.splice(1, 0, "Booking");
    }
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <nav className={`flex items-center justify-between h-16 px-8 ${scrolled ? "scrolled" : ""} overflow-hidden`}>
            <span>
                <NavLink to="/" className="text-base md:text-xl font-bold text-black">
                    Pearl <span className="text-horizon">Horizon</span> Airline
                </NavLink>
            </span>

            <span>
                <ul className="hidden md:flex items-center">
                    {taskbarItems.map((item) => (
                        <li key={item} className="inline-block ml-6">
                            <NavLink
                                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`}
                                className={({ isActive }) => (isActive ? "text-horizon" : "text-black")}>
                                {item}
                            </NavLink>
                        </li>
                    ))}
                    <span className="material-symbols-outlined mr-1">person</span>
                    <NavLink
                        to="/accounts/login"
                        id="account"
                        className="flex items-center border border-horizon rounded-sm px-3 py-1 ml-6 cursor-pointer hover:bg-horizon hover:text-white transition-colors duration-300">
                        {accountText}
                    </NavLink>
                </ul>
            </span>
        </nav>
    );
}
export default Navbar;
