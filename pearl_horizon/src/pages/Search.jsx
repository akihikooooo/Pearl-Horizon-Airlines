import { Outlet, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./stylesheets/Search.css";

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

  return (
    <>
      <div
        id="cont"
        className="w-9/12 border rounded-md border-horizon bg-dusk-pale flex justify-center items-center flex-col h-full my-2 shadow-md"
      >
        <div className="flex flex-col md:flex-row justify-between items-stretch w-full h-full gap-0 pl-2 pt-2">
          <div
            id="flight-info"
            className="w-full h-full md:w-1/2 font-medium flex items-start justify-center flex-col"
          >
            <div>{result.flight_id}</div>
            <div className="flex items-center justify-center gap-10 w-full">
              <span
                id="origin"
                className="flex justify-center items-center flex-col gap-0"
              >
                <p className="">
                  {new Date(
                    result.departure_timestamp * 1000,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p className="uppercase">{result.origin_airport_id}</p>
              </span>
              <span
                id="graphics"
                className="flex justify-center items-center text-horizon-deep gap-2 flex-1 w-full"
              >
                <span className="material-symbols-outlined">
                  flight_takeoff
                </span>
                <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" />
                <span className="material-symbols-outlined">flight_land</span>
              </span>
              <span
                id="destination"
                className="flex justify-center items-center flex-col gap-0"
              >
                <p>21:30</p>
                <p className="uppercase">Ceb</p>
              </span>
            </div>
            <div className="flex px-2 gap-0 border-t-2 border-horizon-deep w-full">
              <p>Flight Duration: {formatTime(result.duration)}</p>
            </div>
          </div>
          <div
            id="flight-price"
            className="md:w-1/2 flex items-stretch justify-end gap-4 pr-4 font-medium text-xl"
          >
            <button
              onClick={() => {}}
              className="flex flex-row items-center justify-center gap-2 px-2 h-12/12 w-full"
            >
              2,500
            </button>
            <button
              onClick={() => navigate(`/booking?passengers=${passengers}`)}
              className={`text-xs h-1/2 bg-horizon text-white px-4 py-2 rounded-sm self-center`}
            >
              Book Flight
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Search = () => {
  const [filter, setFilter] = useState("Relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [searchParams] = useSearchParams();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departure = searchParams.get("departure");
  const passenger = searchParams.get("passengers");

  useEffect(() => {
    axios
      .get("http://192.168.100.8:8000/api/search/flights", {
        params: {
          route: searchParams.get("route"),
          origin: searchParams.get("origin"),
          destination: searchParams.get("destination"),
          departuredate: searchParams.get("departure"),
          passengers: searchParams.get("passengers"),
          // TODO: put return date logic here
        },
      })
      .then((response) => {
        console.log(response.data);
        setSearchResults(response.data);
      });
  }, [searchParams]);
  console.log(searchResults);
  return (
    <div className="search-page pt-14 flex flex-col">
      <div id="header" className="md:px-20 py-2 md:py-10">
        <h1 className="md:text-4xl text-horizon font-semibold flex items-center justify-center md:tracking-wider">
          Search Flights
        </h1>
      </div>
      <div
        id="flight-details"
        className="px-2 md:px-20 flex justify-between gap-0 bg-horizon"
      >
        <div className="flex gap-6 w-full">
          <div>
            <p
              id="origin-destination"
              className="text-2xl md:text-4xl text-sky-cloud font-medium flex items-center justify-start uppercase"
            >
              {origin}
              <span className="material-symbols-outlined">travel</span>
              {destination}
            </p>
            <p id="flight-date" className="text-sky-white m-0">
              {departure}
            </p>
          </div>
          <div className="text-white text-center">
            <span className="text-xs">Passenger Count</span> <br /> {passenger}
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 text-sky-white cursor-pointer rounded-sm">
          <span class="material-symbols-outlined">edit</span>
          Edit
        </div>
      </div>
      <div id="search-results" className="px-2 md:px-8 py-2">
        <div className="flex md:flex-row flex-col items-center justify-between gap-2 rounded-sm md:pl-2 md:h-16 border border-horizon mb-2 bg-sky-cloud shadow-xl">
          {/* Toggle button — mobile only */}
          <button
            className="flex items-center gap-2 md:hidden px-3 py-1 border border-horizon rounded-sm"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <span className="material-symbols-outlined">filter_list</span>
            {showFilters ? "Hide filters" : "Filter"}
          </button>
          {/* Filter buttons */}
          <div
            className={` md:flex-row flex-wrap items-center gap-2 ${showFilters ? "flex" : "hidden"} md:flex`}
          >
            {["Relevance", "Fastest", "Latest", "Earliest", "Cheapest"].map(
              (item) => (
                <button
                  key={item}
                  className={`px-3 py-1 rounded-sm transition-colors duration-75 ${
                    filter === item
                      ? "border border-horizon bg-horizon text-white"
                      : "border border-horizon hover:bg-horizon hover:text-white"
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item === "Relevance" ? "Most Relevance" : item}
                </button>
              ),
            )}
          </div>{" "}
          {/* 👈 this was missing */}
        </div>

        <div id="results" className="flex justify-center items-center flex-col">
          {searchResults.map((result) => {
            return <RenderResults result={result} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
