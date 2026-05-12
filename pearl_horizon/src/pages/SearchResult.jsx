import axios from "axios";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import "./stylesheets/searchresults.css";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}H`);
    if (minutes > 0) parts.push(`${minutes}M`);

    return parts.join(" ");
}

const RenderResults = ({ result }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passengers = parseInt(searchParams.get("passengers")) || 1;
    const route = searchParams.get("route");
    const bookFlight = (flightID) => {
        navigate({
            pathname: "/booking",
            search: `?${createSearchParams({
                passengers: passengers,
                bookingID: "d12k",
                flightID: flightID,
                route: route
            })}`,
        });
    };
    return (
        <>
            <div
                id="cont"
                className="w-9/12 border rounded-md border-horizon bg-horizon-tint flex justify-center items-center flex-col h-full my-2 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-stretch w-full h-full gap-0">
                    {/* Toward */}
                    <div id="flight-info" className="w-full h-full md:w-1/2 font-medium flex items-start justify-center flex-col">
                        <div className="w-full bg-dusk-deep text-horizon-tint font-bold pl-2 rounded-tl-md">{result.flight_id}</div>
                        <div className="flex items-center justify-center gap-10 w-full pl-3 text-dusk-deep mt-2">
                            <span id="origin" className="flex justify-center items-center flex-col gap-0">
                                <p className="">
                                    {new Date(result.departure_timestamp * 1000).toLocaleDateString([], {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                    <br />
                                    {new Date(result.departure_timestamp * 1000).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </p>
                                <p className="uppercase">{result.origin_airport_id}</p>
                            </span>
                            <span id="graphics" className="flex justify-center items-center text-dusk-deep gap-2 flex-1 w-full">
                                <span className="material-symbols-outlined">flight_takeoff</span>
                                <span className="flex-1 w-full border-t-2 border-dotted border-dusk-deep" />
                                <span className="material-symbols-outlined">flight_land</span>
                            </span>
                            <span id="destination" className="flex justify-center items-center flex-col gap-0">
                                <p>
                                    17 May
                                    <br />
                                    {new Date((result.departure_timestamp + result.flight_time) * 1000).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </p>
                                <p className="uppercase">{result.destination_airport_id}</p>
                            </span>
                        </div>
                        <div className="flex px-2 gap-0 border-t-2 border-dusk-deep w-full">
                            <p>Flight Duration: {formatTime(result.flight_time)}</p>
                        </div>
                        {/* Back */}
                    </div>
                    {searchParams.get("route") == "roundtrip" ? (
                        <div id="flight-info" className={ `w-full h-full md:w-1/2 font-medium items-start justify-center flex-col` }>
                            <div className="w-full bg-horizon-deep text-horizon-tint font-bold pl-2">{result.flight_id}</div>
                            <div className="flex items-center justify-center gap-10 w-full pl-3 text-horizon-deep mt-2">
                                <span id="origin" className="flex justify-center items-center flex-col gap-0">
                                    <p className="">
                                        {new Date(result.departure_timestamp * 1000).toLocaleDateString([], {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                        <br />
                                        {new Date(result.departure_timestamp * 1000).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </p>
                                    <p className="uppercase">{result.origin_airport_id}</p>
                                </span>
                                <span id="graphics" className="flex justify-center items-center text-horizon-deep gap-2 flex-1 w-full">
                                    <span className="material-symbols-outlined">flight_takeoff</span>
                                    <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" />
                                    <span className="material-symbols-outlined">flight_land</span>
                                </span>
                                <span id="destination" className="flex justify-center items-center flex-col gap-0">
                                    <p>
                                        17 May
                                        <br />
                                        {new Date((result.departure_timestamp + result.flight_time) * 1000).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </p>
                                    <p className="uppercase">{result.destination_airport_id}</p>
                                </span>
                            </div>
                            <div className="flex px-2 gap-0 border-t-2 border-horizon-deep w-full">
                                <p>Flight Duration: {formatTime(result.flight_time)}</p>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div id="flight-price" className="md:w-1/2 flex items-stretch justify-end gap-4 pr-4 font-medium text-xl">
                        <button onClick={() => {}} className="flex flex-row items-center justify-center gap-2 px-2 h-12/12 w-full">
                            Seats Available<br/>
                            {result.economy}
                        </button>
                        <button
                            onClick={() => bookFlight(result.flight_id)}
                            className={`text-xs h-1/2 bg-horizon text-white px-4 py-2 rounded-sm self-center`}>
                            Book Flight
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const SearchResult = () => {
    const [searchResults, setSearchResults] = useState([]);

    const [searchParams] = useSearchParams();

    const route = searchParams.get("route");
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departure = new Date(searchParams.get("departure"));
    const passenger = searchParams.get("passengers");
    const returnDate = searchParams.get("return") != "null" ? new Date(searchParams.get("return")) : null;

    useEffect(() => {
        axios
            .get(`${apiUrl}/api/search/flights`, {
                params: {
                    route: searchParams.get("route"),
                    origin: origin,
                    destination: destination,
                    departuredate: departure.getTime() / 1000,
                    ...(returnDate ? { returndate: new Date(returnDate).getTime() / 1000 } : {}),
                    // TODO: put return date logic here
                },
            })
            .then((response) => {
                setSearchResults(response.data);
            });
    }, [searchParams]);
    return (
        <div className="search-page pt-16 flex flex-col">
            <div id="flight-details" className="px-2 md:px-20 flex justify-center gap-2 bg-horizon">
                <div className="flex gap-2 justify-center items-center">
                    <p id="origin-destination" className="text-2xl md:text-4xl text-sky-white font-medium flex items-center justify-start uppercase">
                        {origin}
                        <span className="material-symbols-outlined">{route == "roundtrip" ? "compare_arrows" : "travel"}</span>
                        {destination}
                    </p>
                    <div className="w-1 h-9/12 bg-horizon-tint" />
                    <span className="flex gap-1 items-center">
                        <p id="flight-date" className="text-sky-white m-0">
                            {departure.toDateString()}
                        </p>
                        <span className={`text-sky-white ${route == "oneway" ? "hidden" : ""} translate-y-0.5`}>
                            <span className={`material-symbols-outlined`}>calendar_month</span>
                        </span>
                        {route == "roundtrip" ? (
                            <p id="flight-date" className={`text-sky-white m-0 ${route == "oneway" ? "hidden" : ""}`}>
                                {returnDate.toDateString()}
                            </p>
                        ) : (
                            <></>
                        )}
                    </span>
                    <div className="w-1 h-9/12 bg-horizon-tint" />
                    <span className="flex items-center">
                        <p id="passengers" className="text-sky-white m-0">
                            {passenger}
                        </p>
                        <span className="material-symbols-outlined text-sky-white">person</span>
                    </span>
                </div>
                {/* <div id="modify" className="flex justify-center items-center gap-2 text-sky-white cursor-pointer">
                    <span class="material-symbols-outlined">edit</span>
                    Edit
                </div> */}
            </div>
            <div id="search-results" className="px-2 md:px-8 py-2">
                {/* <div className="flex md:flex-row flex-col items-center justify-between gap-2 rounded-sm md:pl-2 md:h-16 border border-horizon mb-2 bg-sky-cloud shadow-xl">
                    {/* Toggle button — mobile only
                    <button
                        className="flex items-center gap-2 md:hidden px-3 py-1 border border-horizon rounded-sm"
                        onClick={() => setShowFilters((prev) => !prev)}>
                        <span className="material-symbols-outlined">filter_list</span>
                        {showFilters ? "Hide filters" : "Filter"}
                    </button>
                    {/* Filter buttons *
                    <div className={` md:flex-row flex-wrap items-center gap-2 ${showFilters ? "flex" : "hidden"} md:flex`}>
                        {["Relevance", "Fastest", "Latest", "Earliest", "Cheapest"].map((item) => (
                            <button
                                key={item}
                                className={`px-3 py-1 rounded-sm transition-colors duration-75 ${filter === item ? "border border-horizon bg-horizon text-white" : "border border-horizon hover:bg-horizon hover:text-white"}`}
                                onClick={() => setFilter(item)}>
                                {item === "Relevance" ? "Most Relevance" : item}
                            </button>
                        ))}
                    </div> 
                </div> */}

                <div id="results" className="flex justify-center items-center flex-col">
                    {searchResults.length != 0 ? (searchResults.map((result) => {
                        return <RenderResults result={result} />;
                    })): <div>No Flights found...</div>}
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
