import "./stylesheets/search.css";
import InputField from "../components/InputField";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function Search() {
    const navigate = useNavigate();
    const [tripType, setTripType] = useState("oneway");
    const handleSearch = (e) => {
        e.preventDefault();
        let form = new FormData(e.target);
        console.log(form.get("From"));
        console.log(form.get("To"));
        console.log(form.get("Departure"));
        console.log(form.get("Passengers"));
        navigate({
            pathname: "/search/results",
            search: `?${createSearchParams({
                route: tripType,
                origin: form.get("From"),
                destination: form.get("To"),
                departure: form.get("Departure"),
                return: form.get("Return"),
                passengers: form.get("Passengers"),
            })}`,
        });
    };

    return (
        <div id="cont" className="pt-16">
            <div id="searchheader" className="h-80 p-20">
                <p className="text-5xl text-sky-white font-medium">Search a Flight</p>
                <p className="text-2xl text-sky-white font-medium">Find your perfect flight</p>
            </div>
            <div className=" bg-sky-white border border-sky-cloud shadow-xl shadow-sky-night/20 m-2 p-4 md:p-8 rounded-sm flex justify-center flex-col">
                <div className="flex border border-sky-cloud mb-6 rounded-sm overflow-hidden">
                    {["oneway", "roundtrip"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTripType(type)}
                            className={`flex-1 py-2.5 text-[0.8rem] tracking-wide transition-colors font-medium
                                  ${tripType === type ? "bg-horizon text-white" : "text-sky-slate hover:text-sky-night bg-transparent"}`}>
                            {type === "oneway" ? "One Way" : "Round Trip"}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="From" placeholder="Manila (MNL)" type="text" />
                        <InputField label="To" placeholder="Cebu (CEB)" type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Departure" type="date" />
                        {tripType === "roundtrip" && <InputField label="Return" type="date" />}
                    </div>
                    <InputField label="Passengers" type="number" placeholder="1" min="1" max="9" />
                    <div className="w-full p-2 border-2 border-red-400 bg-red-300 flex justify-center items-center gap-2 text-red-900 font-medium">
                        <span class="material-symbols-outlined">exclamation</span>
                        Error
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-horizon text-white py-3.5 text-sm font-medium tracking-widest hover:bg-horizon-deep transition-colors mt-1">
                        Search Flights
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Search;
