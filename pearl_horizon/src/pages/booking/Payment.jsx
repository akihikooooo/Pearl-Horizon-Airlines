import { useLocation, useNavigate } from "react-router-dom";
import {InputField} from "../../components/InputField";
import { useState } from "react";
import "../stylesheets/payment.css";
import GCash from "../../assets/GCASH.JPG";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

function TextFields({ styles, start, middle, end }) {
    return (
        <>
            <div className={`w-full flex justify-between items-center ${styles}`}>
                <h1 className="text-md font-bold w-3/12">{start}</h1>
                {/* <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" /> */}
                <p className="text-md font-normal w-3/12 text-center">{middle}</p>
                {/* <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" /> */}
                <p className="text-md font-normal w-3/12 text-right">{end}</p>
            </div>
        </>
    );
}

function PaymentView({ onSubmit }) {
    const [mode, setMop] = useState("GCash");

    return (
        <>
            <div className="bg-black w-full h-full absolute top-0 left-0 opacity-50 z-10"></div>
            <div className="bg-white w-8/12 p-6 rounded-lg z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-2xl text-horizon-deep font-bold mb-4">Payment</h1>
                <div className="flex border border-sky-cloud mb-6 rounded-sm overflow-hidden">
                    {["GCash", "Card"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setMop(type)}
                            className={`flex-1 py-2.5 text-[0.8rem] tracking-wide transition-colors font-medium
                          ${mode === type ? "bg-horizon text-white" : "text-sky-slate hover:text-sky-night bg-transparent"}`}>
                            {type}
                        </button>
                    ))}
                </div>
                {mode === "GCash" ? (
                    <form onSubmit={onSubmit} className={`flex flex-col gap-4`}>
                        <div className="flex items-center justify-center gap-6 w-full pl-3 text-horizon-deep mt-2">
                            <img src={GCash} alt="GCash" className="w-3/12" />
                            <InputField label="GCash Receipt" type="file" placeholder="" required />
                        </div>
                        <button
                            onClick={{}}
                            className="bg-horizon text-white px-4 py-2 rounded mt-4 hover:bg-horizon-dark transition-colors duration-300">
                            Pay Now
                        </button>
                    </form>
                ) : (
                    <form onSubmit={onSubmit} className={`flex flex-col gap-4`}>
                        <div className="flex gap-4">
                            <InputField label="Card Number" type="text" placeholder="1234 5678 9012 3456" required />
                            <InputField label="Expiration Date" type="text" placeholder="MM/YY" required />
                            <InputField label="CVV" type="text" placeholder="123" required />
                        </div>
                        <button
                            onClick={{}}
                            className="bg-horizon text-white px-4 py-2 rounded mt-4 hover:bg-horizon-dark transition-colors duration-300">
                            Pay Now
                        </button>
                    </form>
                )}
                {/* CARD */}
            </div>
        </>
    );
}

function Payment() {
    const navigate = useNavigate()
    const { state } = useLocation();
    const [showPayment, setShowPayment] = useState(false);

    const travelqty = state.passengers.length;
    const sandwichqty = state.passengers.filter((p) => p.meal_preference === "Sandwich").length;
    const drinksqty = state.passengers.filter((p) => p.meal_preference === "Drink").length;
    const snacksqty = state.passengers.filter((p) => p.meal_preference === "Snack").length;
    const travelPrice = 30.0 * travelqty;
    const sandwichPrice = 30.0 * sandwichqty;
    const drinksPrice = 15.0 * drinksqty;
    const snacksPrice = 20.0 * snacksqty;
    const totalPrice = travelPrice + sandwichPrice + drinksPrice + snacksPrice;

    function onSubmit(e) {
        // warn: this is just mocked, walang actual saving of credentials na nangyayari here
        e.preventDefault()
        axios
            .post(`${apiUrl}/api/book/entry`, { flight_id: state.flight_id, amount_due: totalPrice, passengers: state.passengers })
            .then(() => {alert("Successully booked. (btw this popup is still wip papalitan sya :3)"); navigate("/accounts")});
    }
    return (
        <>
            <div id="cont" className="pt-16 w-full flex justify-center items-center flex-col gap-6">
                {/* <h1 className="text-3xl font-bold mb-4">Payment</h1> */}
                <p className="text-3xl text-horizon font-bold text-center ">Summary</p>
                <div id="summary " className=" w-6/12 rounded-md p-6 flex flex-col gap-4">
                    <div className="w-full bg-sky-cloud flex flex-col justify-between rounded-lg p-2">
                        <h1 id="header" className="header font-medium flex gap-6 items-center justify-between">
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                            Flight Details
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                        </h1>
                        <TextFields styles="" start="Flight ID:" end={state.flight_id} />
                        <TextFields styles="" start="Trip Type:" end={state.route} />
                        <TextFields styles="" start="Passenger Number:" end={state.passengers.length} />
                    </div>
                    <div className="w-full bg-sky-cloud flex flex-col justify-between rounded-lg p-2">
                        <h1 id="header" className="header font-medium flex gap-6 items-center justify-between">
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                            Payment Summary
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                        </h1>
                        <TextFields styles="" start="Flight Ticket" middle={travelqty} end={travelPrice} />
                        <h1 id="header" className="header font-medium flex gap-6 items-center justify-center    ">
                            Add-ons
                        </h1>
                        <TextFields styles="" start="Sandwich" middle={sandwichqty} end={sandwichPrice} />
                        <TextFields styles="" start="Drinks" middle={drinksqty} end={drinksPrice} />
                        <TextFields styles="" start="Snacks" middle={snacksqty} end={snacksPrice} />
                    </div>
                    <div className="w-full bg-sky-cloud flex flex-col justify-between rounded-lg p-2">
                        <TextFields styles="" start="Grand Total" end={totalPrice} />
                    </div>
                </div>
                <button className="bg-horizon text-sky-white px-4 py-2 rounded-lg" onClick={() => setShowPayment(true)}>
                    Proceed to Payment
                </button>
                {showPayment ? <PaymentView onSubmit={onSubmit} /> : <></>}
            </div>
        </>
    );
}

export default Payment;
