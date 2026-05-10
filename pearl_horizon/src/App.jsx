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
import AccountManagement from "./pages/Account.jsx";
import AdminPanel from "./pages/Admin.jsx";
import { AdminRoutes } from "./services/admin.jsx";

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

                <Route path="/search" element={<Search />} />
                <Route path="/search/results" element={<Booking />} />

                <Route element={<ProtectedRoutes accounts={true} />}>
                    <Route path="/accounts/login" element={<Login />} />
                    <Route path="/accounts/signup" element={<Signup />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoutes accounts={false} />}>
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/booking/seatmap" element={<SeatMap />} />

                    <Route element={<AdminRoutes />}>
                        <Route path="/admin" element={<AdminPanel />} />
                    </Route>

                    <Route path="/accounts" element={<AccountManagement />} />
                </Route>
            </Routes>
            <div id="colors" className="flex justify-between">
                <div className="h-2 w-full bg-horizon"></div>
                <div className="h-2 w-full bg-horizon-deep"></div>
                <div className="h-2 w-full bg-horizon-tint"></div>
                <div className="h-2 w-full bg-sky-white"></div>
                <div className="h-2 w-full bg-sky-cloud"></div>
                <div className="h-2 w-full bg-sky-slate"></div>
                <div className="h-2 w-full bg-dusk-warm"></div>
                <div className="h-2 w-full bg-dusk-deep"></div>
                <div className="h-2 w-full bg-dusk-pale"></div>
                <div className="h-2 w-full bg-horizon"></div>
                <div className="h-2 w-full bg-horizon"></div>
            </div>
            <Footer />
        </>
    );
}

export default App;
