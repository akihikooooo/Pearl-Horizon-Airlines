import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Footer from "./components/Footer"
import Login from "./pages/Login";
import Search from "./pages/Search.jsx";
import SeatMap from "./pages/Seatmap.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes className="">
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search/>}/>
        <Route path="/search/results" element={<Booking/>}/>
        <Route path="/search/Results/Seatmap" element={<SeatMap/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
