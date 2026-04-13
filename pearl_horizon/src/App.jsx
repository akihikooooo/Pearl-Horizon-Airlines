import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Footer from "./components/Footer"
import Login from "./pages/Login";
import AnotherHome from "./pages/AnotherHome";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking/>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homehome" element={<AnotherHome/>}/>
      </Routes>
      {/* <Footer/> */}
    </>
  );
}

export default App;
