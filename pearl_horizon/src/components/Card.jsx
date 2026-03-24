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
                <p className="text-gray-600">{description}</p>
                <NavLink to="/booking" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                    Book Now
                </NavLink>
            </div>
        </div>
    )
}

export default Card;