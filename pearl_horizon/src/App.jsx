import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<h1> BOOKING </h1>} />
        <Route path="/" element={<Home />} />
      </Routes>
      {/* <Home/> */}
    </>
  );
}

export default App;
