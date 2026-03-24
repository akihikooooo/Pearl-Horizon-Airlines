import React from "react";
import "../index.css";
import { NavLink } from "react-router-dom";

function Footer(){
    return(
        <div id="cont" className="p-8 bg-blue-500 text-white">
            <div>
                <h1 className="font-bold text-3xl">Pearl Horizon Airlines</h1>
            </div>
            <div className="flex gap-10">
                <span className="flex  flex-col h-10 gap-2">
                    {["Home", "Booking", "About Us"].map((link) => (
                        <NavLink to={link}>{link}</NavLink>
                    ))}
                </span>
                <span className="flex flex-col gap-2">
                    {["Home", "Booking", "About Us"].map((link) => (
                        <NavLink to={link}>{link}</NavLink>
                    ))}
                </span>
            </div>
        </div>
    );
}

export default Footer;