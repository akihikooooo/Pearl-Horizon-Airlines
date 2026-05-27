import { useLocation, useNavigate } from "react-router-dom";
import { InputField } from "../../components/InputField";
import { useState } from "react";
import "../stylesheets/payment.css";
import GCash from "../../assets/GCASH.JPG";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
    const [receiptFile, setReceiptFile] = useState(null);
    const [cardForm, setCardForm] = useState({
        card_number: "",
        expiry: "",
        cvv: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ mode, receiptFile, cardForm });
    }

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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex items-center justify-center gap-6 w-full pl-3 text-horizon-deep mt-2">
                            <img src={GCash} alt="GCash" className="w-3/12" />
                            <InputField
                                label="GCash Receipt"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                placeholder=""
                                required
                                onChange={(e) => setReceiptFile(e.target.files[0])}
                            />
                        </div>
                        <button className="bg-horizon text-white px-4 py-2 rounded mt-4 hover:bg-horizon-dark transition-colors duration-300">
                            Pay Now
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <InputField
                                label="Card Number"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                required
                                onChange={(e) => setCardForm((prev) => ({ ...prev, card_number: e.target.value.replace(/\s/g, "") }))}
                            />
                            <InputField
                                label="Expiration Date"
                                type="text"
                                placeholder="MM/YY"
                                required
                                onChange={(e) => setCardForm((prev) => ({ ...prev, expiry: e.target.value }))}
                            />
                            <InputField
                                label="CVV"
                                type="text"
                                placeholder="123"
                                required
                                onChange={(e) => setCardForm((prev) => ({ ...prev, cvv: e.target.value }))}
                            />
                        </div>
                        <button className="bg-horizon text-white px-4 py-2 rounded mt-4 hover:bg-horizon-dark transition-colors duration-300">
                            Pay Now
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}

function RatingModal({ onClose }) {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [suggestion, setSuggestion] = useState("");

    function handleSubmit() {
        // optionally POST rating + suggestion to your API here
        axios
            .post(`${apiUrl}/api/book/feedback`, {
                rating: rating,
                comments: suggestion,
            })
            .then(() => {
                toast("Thank you for your feedback!");
            })
            .catch(() => {
                toast(`Failed to submit feedback, Contact the Administrator.`);
            })
            .finally(() => {
                onClose();
                navigate("/accounts");
            });
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-30" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-white rounded-xl shadow-xl p-6 w-5/12 flex flex-col gap-4">
                <button onClick={handleSubmit} className="absolute top-3 right-3">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-horizon" style={{ fontSize: "3rem" }}>
                        check_circle
                    </span>
                    <h2 className="text-xl font-bold text-horizon-deep">Booking Confirmed!</h2>
                    <p className="text-sm text-gray-500">How was your booking experience?</p>
                </div>

                {/* Star Rating */}
                <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className="material-symbols-outlined cursor-pointer select-none transition-colors"
                            style={{
                                fontSize: "2.5rem",
                                color: star <= (hovered || rating) ? "#f59e0b" : "#d1d5db",
                                fontVariationSettings: star <= (hovered || rating) ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400",
                            }}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(star)}>
                            star
                        </span>
                    ))}
                </div>

                {/* Optional suggestions */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">
                        Other suggestions <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        className="w-full border border-gray-200 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-horizon"
                        rows={3}
                        placeholder="Tell us what we can improve..."
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-horizon text-white py-2 rounded-lg text-sm font-medium hover:bg-horizon-deep transition-colors">
                    Submit & Go to My Flights
                </button>
            </div>
        </>
    );
}

function Payment() {
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [suggestion, setSuggestion] = useState("");
    const navigate = useNavigate();
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

    const [paymentMode, setPaymentMode] = useState(null);
    const [cardDetails, setCardDetails] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);

    function onSubmit({ mode, receiptFile, cardForm }) {
        const formData = new FormData();

        formData.append(
            "payload",
            JSON.stringify({
                flight_id: state.flight_id,
                amount_due: totalPrice,
                passengers: state.passengers,
            }),
        );

        if (mode === "GCash") {
            formData.append("payment_mode", "receipt");
            formData.append("receipt", receiptFile);
        } else {
            // Parse MM/YY into separate fields for the backend
            const [expiry_month, expiry_year] = cardForm.expiry.split("/").map(Number);
            formData.append("payment_mode", "credit_card");
            formData.append(
                "card_details",
                JSON.stringify({
                    cardholder_name: "N/A", // your card form doesn't collect this; add an InputField if needed
                    card_number: cardForm.card_number,
                    expiry_month,
                    expiry_year: expiry_year + 2000, // "27" -> 2027
                    cvv: cardForm.cvv,
                }),
            );
        }

        axios
            .post(`${apiUrl}/api/book/entry`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(async () => {
                setShowPayment(false);
                setShowRating(true);
            })
            .catch((err) => {
                toast(`Booking failed, check Console for Details.`);
                console.error("Booking error:", err.response || err);
            });
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
                {showPayment && (
                    <PaymentView
                        onSubmit={onSubmit}
                        paymentMode={paymentMode}
                        setPaymentMode={setPaymentMode}
                        setCardDetails={setCardDetails}
                        setReceiptFile={setReceiptFile}
                    />
                )}
                {showRating && <RatingModal onClose={() => setShowRating(false)} />}
                <ToastContainer />
            </div>
        </>
    );
}

export default Payment;
