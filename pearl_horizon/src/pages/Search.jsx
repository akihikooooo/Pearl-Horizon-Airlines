import { Outlet, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./stylesheets/Search.css";

// function formatTime(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
  
//   const parts = [];
//   if (hours > 0) parts.push(`${hours}H`);
//   if (minutes > 0) parts.push(`${minutes}M`);
  
//   return parts.join(' ');
// }



const RenderResults = ({result}) => {
  const [selectedClass, setSelectedClass] = useState("");

  return (
    <>
      <div
        id="cont"
        className="w-full border border-horizon bg-dusk-pale flex justify-center items-center flex-col h-full my-2 shadow-md"
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
                <p className="">{new Date(result.departure_timestamp*1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})}</p>
                <p className="uppercase">{result.origin_airport_id}</p>
              </span>
              <span
                id="graphics"
                className="flex justify-center items-center text-horizon-deep gap-2 flex-1 w-full"
              >
                <span className="material-symbols-outlined">
                  flight_takeoff
                </span>
                <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep"/>
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
              <p>Flight Duration: 2H</p>
            </div>
          </div>
          <div
            id="flight-price"
            className="md:w-1/2 flex items-stretch justify-end gap-4 pr-4 font-medium text-xl"
          >
            {/* Economy */}
            <button
              onClick={() => {
                setSelectedClass("Economy");
              }}
              className="flex flex-row items-center justify-center gap-2 px-2 h-12/12 w-full border-b-6 border-horizon-tint"
            >
              2,500
              {selectedClass === "Economy" && (
                <span className="material-symbols-outlined text-horizon">
                  check_circle
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedClass("Business");
              }}
              className="flex flex-row items-center justify-center gap-2 px-2 h-full w-full border-b-6 border-horizon-deep"
            >
              2,500
              {selectedClass === "Business" && (
                <span className="material-symbols-outlined text-horizon">
                  check_circle
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedClass("First");
              }}
              className="flex flex-row items-center justify-center gap-2 px-2 h-full w-full border-b-6 border-horizon "
            >
              2,500
              {selectedClass === "First" && (
                <span className="material-symbols-outlined text-horizon">
                  check_circle
                </span>
              )}
            </button>
          </div>
        </div>
        <div id="book-cont" className={` ${selectedClass != "" ? "flex justify-center items-center" : "hidden"} bg-sky-cloud w-full h-16 flex justify-end items-center px-2`}>
              <span className="font-semibold text-horizon mr-4">
                Total Amount: 2,500
              </span>

              <button
          className={` ${selectedClass != "" ? "flex justify-center items-center" : "hidden"} bg-horizon text-white px-4 py-2 rounded-sm`}
        >
          Book Flight
        </button>
        </div>
      </div>
    </>
  );
};

const Search = () => {
  const [filter,setFilter] = useState("Relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    axios.get("http://192.168.100.8:8000/api/search/flights", {
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
      <div id="search-results" className="px-2 md:px-8 py-2">
        <div
          className="flex md:flex-row flex-col items-center justify-between gap-2 rounded-sm md:pl-2 md:h-16 border mb-2 bg-sky-cloud shadow-xl"
        >
          {/* Toggle button — mobile only */}
          <button
            className="flex items-center gap-2 md:hidden px-3 py-1 border border-horizon rounded-sm"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <span className="material-symbols-outlined">filter_list</span>
            {showFilters ? "Hide filters" : "Filter"}
          </button>

          {/* Filter buttons */}
          <div className={` md:flex-row flex-wrap items-center gap-2 ${showFilters ? "flex" : "hidden"} md:flex`}>
            {["Relevance", "Fastest", "Latest", "Earliest", "Cheapest"].map((item) => (
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
            ))}
          </div> {/* 👈 this was missing */}

          {/* Flight Classes */}
          <div className="flex justify-center items-center h-full w-full md:w-1/2">
            <span className="font-semibold bg-horizon-tint text-horizon p-1 w-full h-full flex justify-center items-center">
              Economy
            </span>
            <span className="font-semibold bg-horizon-deep text-horizon-tint p-1 w-full h-full flex justify-center items-center">
              Business
            </span>
            <span className="font-semibold bg-horizon text-sky-cloud p-1 w-full h-full flex justify-center items-center">
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
