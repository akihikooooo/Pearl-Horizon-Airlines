import { Route, Routes } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { BackendContext, Backend } from "./backend/useBackend";
import Footer from "./components/Footer";
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
