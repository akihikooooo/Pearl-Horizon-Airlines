import { Outlet, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./stylesheets/Search.css";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}H`);
  if (minutes > 0) parts.push(`${minutes}M`);
  
  return parts.join(' ');
}

const RenderResults = ({result}) => {
const RenderResults = () => {
  const [selectedClass, setSelectedClass] = useState("");
  return (
    <>
      <div id="cont" className="w-full border border-horizon bg-dusk-pale flex pt-2 pb-2 pl-2">
        <div
          id="flight-info"
          className="w-1/2 font-medium flex items-start justify-center flex-col"
        >
          <div className="flex items-center justify-center gap-10">
            <span id="origin" className="flex justify-center items-center flex-col gap-0">
                <p>{new Date(result.departure_timestamp*1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})}</p>
                <p className="uppercase">{result.origin_airport_id}</p>
            </span>
            <span
              id="graphics"
              className="flex justify-center items-center text-horizon-deep gap-2"
            >
              <span className="material-symbols-outlined">flight_takeoff</span>
              <span className="flex justify-center items-center gap-1">
                {[...Array(50)].map((_, i) => {
                  return (
                    <span
                      key={i}
                      className="inline-block w-1 h-1 rounded-full bg-horizon-deep"
                    />
                  );
                })}
              </span>
              <span className="material-symbols-outlined">flight_land</span>
            </span>
            <span id="destination" className="flex justify-center items-center flex-col gap-0">
                <p>{new Date((result.departure_timestamp+result.flight_time)*1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})}</p>
                <p className="uppercase">{result.destination_airport_id}</p>
            </span>
          </div>
          <div className="flex px-2 gap-0 border-t-2 border-horizon-deep w-full">
            <p>Flight Duration: {formatTime(result.flight_time)}</p>
          </div>
        </div>
        <div
          id="flight-price"
          className="w-1/2 flex items-center justify-end gap-4 pr-4 font-medium text-xl"
        >
          {/* Economy */}
          <button onClick={() => {setSelectedClass("Economy")}} className="flex flex-col items-center justify-center gap-2 px-2 h-full w-full border-b-6 border-horizon-tint">
                2,500
                {selectedClass === "Economy" && <span className="material-symbols-outlined text-horizon">check_circle</span>}
            </button>
          <button onClick={() => {setSelectedClass("Business")}} className="flex flex-col items-center justify-center gap-2 px-2 h-full w-full border-b-6 border-horizon-deep">
                2,500
                {selectedClass === "Business" && <span className="material-symbols-outlined text-horizon">check_circle</span>}
            </button>
          <button onClick={() => {setSelectedClass("First")}} className="flex flex-col items-center justify-center gap-2 px-2 h-full w-full border-b-6 border-horizon ">
                2,500
                {selectedClass === "First" && <span className="material-symbols-outlined text-horizon">check_circle</span>}
            </button>
        </div>
      </div>
    </>
  );
};

const Search = () => {
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    axios.get("http://localhost:8000/api/search/flights", {
      params: {
        route: searchParams.get("route"),
        origin: searchParams.get("origin"),
        destination: searchParams.get("destination"),
        departuredate: searchParams.get("departure"),
        // TODO: put return date logic here
    }})
    .then((response) => {
      setSearchResults(response.data)
    })
  }, [searchParams])
  return (
    <div className="search-page pt-14">
      <div id="header" className="md:px-20 py-2 md:py-10">
        <h1 className="md:text-4xl text-horizon font-semibold flex items-center justify-center md:tracking-wider">
          Search Flights
        </h1>
      </div>
      <div
        id="flight-details"
        className="px-2 md:px-20 flex justify-between gap-0 bg-horizon"
      >
        <div>
          <p
            id="origin-destination"
            className="text-2xl md:text-4xl text-sky-cloud font-medium flex items-center justify-start uppercase"
          >
            {searchParams.get("origin")}<span className="material-symbols-outlined">travel</span>{searchParams.get("destination")}
          </p>
          <p id="flight-date" className="text-sky-white m-0">
            {new Date(searchParams.get("departure")).toDateString()}
          </p>
        </div>
        <div className="flex justify-center items-center gap-2 text-sky-white cursor-pointer rounded-sm">
          <span class="material-symbols-outlined">edit</span>
          Edit
        </div>
      </div>
      <div id="search-results" className="px-2 md:px-8 py-2">
        <div
          id="filter-strip"
          className="flex items-center justify-between gap-2 rounded-sm pl-2 h-16 border mb-2 ng-sky-cloud shadow-xl"
        >
          {/* Filter button for mobile */}
          <div className="flex justify-center items-center gap-2 md:hidden">
            <span class="material-symbols-outlined">filter_list</span>
            Filter
          </div>
          {/* Filters */}
          <div className="flex justify-between items-center gap-2 ">
            {["Relevance", "Fastest", "Latest", "Earliest", "Cheapest"].map(
              (item) => {
                return (
                  <button
                    id="filter"
                    key={item}
                    className={`px-3 py-1 rounded-sm transition-colors duration-75 ${
                      filter === item
                        ? "border border-horizon bg-horizon text-white"
                        : "border border-horizon hover:bg-horizon hover:text-white"
                    }`}
                    onClick={() => setFilter(item)}
                  >
                    {item == "Relevance" ? "Most Relevance" : item}
                  </button>
                );
              },
            )}
          </div>
          {/* Flight Classes */}
          <div id="classes" className="flex justify-center items-center h-full">
            <span className="font-semibold bg-horizon-tint text-horizon p-1 px-16 h-full flex justify-center items-center">
              Economy
            </span>
            <span className="font-semibold bg-horizon-deep text-horizon-tint p-1 px-16 h-full flex justify-center items-center">
              Business
            </span>
            <span className="font-semibold bg-horizon text-sky-cloud p-1 px-16 h-full flex justify-center items-center">
              First Class
            </span>
          </div>
        </div>
        {searchResults.map((result) => {
          return <RenderResults result={result}/>
        })}
      </div>
    </div>
  );
};

export default Search;
