import React from "react";
import {NavLink} from "react-router-dom";
import "../index.css";
import req from "../assets/requirements.jpg";

function Card({ title, description }) {
    return (
        <div id="card">
            <img src={req} alt={title} className="object-cover rounded-t" />
            <div className="p-4">
                <h2 className="font-bold text-lg mb-2">{title}</h2>
                <p className="text-sky-night">{description}</p>
                <NavLink to="/booking" className="mt-4 inline-block bg-dusk-warm text-sky-night font-medium px-4 py-2 rounded hover:bg-dusk-pale transition duration-300">
                    Book Now
                </NavLink>
            </div>
        </div>
    )
}

export default Card;