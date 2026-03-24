import React from "react";
import '../index.css';
import banner from "../assets/booking_banner.jpg";

function Booking(){
return(
    <>
    <div id="cont" className="pt-14">
        <div id="bg-cont" className="m-6 h-56 overflow-hidden">
            {/* <div id="book-overlay"className=""/> */}
            <img src={banner} className="w-full -translate-y-24"/>
        </div>
        {/* selector: book, manage booking */}
        {/* main booking form */}
        {/* usage of useState for the number of passenger then *for* loop the passenger block */}
    </div>
    </>
);
}

export default Booking;