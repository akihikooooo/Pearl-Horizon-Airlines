import { Route, Routes } from "react-router-dom";
import "./App.css";
import { BackendContext, Backend } from "./backend/useBackend";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
function App() {
    const backend = new Backend()
    return (
        <BackendContext.Provider value={{backend}}>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/" element={<Home />} />
            </Routes>
            {/* <Home/> */}
            <Footer />
        </BackendContext.Provider>
    );
}

export default App;
