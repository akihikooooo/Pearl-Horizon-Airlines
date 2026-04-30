import axios from "axios";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Search from "./pages/Search.jsx";
import SeatMap from "./pages/Seatmap.jsx";
import Signup from "./pages/Signup.jsx";
import { ProtectedRoutes } from "./services/auth.jsx";

function App() {
    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);

    return (
        <>
            <Navbar />
            <Routes className="">
                {/* Unprotected Routes */}
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/results" element={<Booking />} />
                <Route path="/accounts/login" element={<Login />} />
                <Route path="/accounts/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoutes />}>
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/search/Results/Seatmap" element={<SeatMap />} />
                </Route>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
