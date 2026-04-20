import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import AnotherHome from "./pages/AnotherHome";
import Search from "./pages/Search.jsx";
import SeatMap from "./pages/Seatmap.jsx";
import Home from "./pages/Home.jsx"
function App() {
  return (
    <>
      <Navbar />
      <Routes className="">
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/homehome" element={<AnotherHome/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/search/results" element={<Booking/>}/>
        <Route path="/search/Results/Seatmap" element={<SeatMap/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
