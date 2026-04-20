import { Outlet } from "react-router-dom";
import "./stylesheets/Search.css";

const renderResults = () => {
  return (
    <>
      <div id="cont" className="w-full border border-horizon flex p-2">
        <div
          id="flight-info"
          className="w-1/2 font-medium flex items-start justify-center flex-col"
        >
          <div className="flex items-center justify-center gap-10">
            <span id="origin" className="flex justify-center items-center flex-col gap-0">
                <p>19:30</p>
                <p className="uppercase">MNL</p>
            </span>
            <span id="graphics"className="flex justify-center items-center text-horizon-deep gap-2">
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
                <p>21:30</p>
                <p className="uppercase">Ceb</p>
            </span>
          </div>
          <div className="flex px-2 gap-0 border-t-2 border-horizon-deep w-full">
            <p>Flight Duration: 2H</p>
          </div>
        </div>
        <div id="flight-price" className="w-1/2 flex items-center justify-center">
          
        </div>
      </div>
    </>
  );
};

const Search = () => {
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
            Mnl<span className="material-symbols-outlined">travel</span>Ceb
          </p>
          <p id="flight-date" className="text-sky-white m-0">
            Thu, 16 Apr
          </p>
        </div>
        <div className="flex justify-center items-center gap-2 text-sky-white cursor-pointer rounded-sm">
          <span class="material-symbols-outlined">edit</span>
          Edit
        </div>
      </div>
      <div id="search-results" className="px-2 md:px-8 py-2">
        <div id="filter" className="flex items-center justify-start gap-2 cursor-pointer rounded-sm p-2 border mb-2 ng-sky-cloud shadow-xl">
            <div className="flex justify-center items-center gap-2 md:hidden">
                <span class="material-symbols-outlined">filter_list</span>
                Filter
            </div>
            <div className="flex justify-center items-center gap-2">
                {["Most Relevance", "Fastest", "Latest", "Earliest", "Cheapest"].map((item) => {
                    return (
                        <span key={item} id="filter" className="hidden md:inline-flex justify-center items-center gap-1 border border-horizon rounded-sm px-3 py-1 cursor-pointer hover:bg-horizon hover:text-white transition-colors duration-75">
                            {item}
                        </span>
                    )
                })}
            </div>
        </div>
        {renderResults()}
      </div>
    </div>
  );
};

export default Search;
