import logo from "../../assets/Pearl Horizon.png";
import QRCode from "react-qr-code";

function Ticket(){
    return(
        <div className="p-16 flex justify-center items-center flex-col gap-2">
            <h1 className="text-2xl font-bold text-horizon">Ticket</h1>
                    <RenderTicket name="John Doe" origin="MNL" destination="CEB" flightID="PH123" flightDate="2023-10-10 20:20" seat="12A" />
                    <RenderTicket name="Jane Smith" origin="MNL" destination="CEB" flightID="PH124" flightDate="2023-10-10 21:20" seat="13A" />
        </div>
    )
}

function RenderTicket({name, origin, destination, flightID, flightDate, seat}){

    return(
        <div id="ticket" className="flex     h-full border w-9/12 text-2xl ">
            <div id="information" className="w-9/12">
                <p className="text-md font-normal w-full text-left bg-horizon p-2 flex items-center gap-2 text-white"><img src={logo} alt="Pearl Horizon Logo" className="h-16" />
                    Pearl Horizon Airlines</p>
                <div className="w-full p-2">
                    <p className="text-md font-normal flex justify-between"><p>{name}</p><p>{seat}</p></p>
                    <div className="flex justify-between">
                        <p className="text-md font-normal w-3/12 ">{origin}</p>
                        <span id="graphics" className="flex justify-center items-center text-horizon-deep gap-2 flex-1 w-full">
                                        <span className="material-symbols-outlined">flight_takeoff</span>
                                        <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" />
                                        <span className="material-symbols-outlined">flight_land</span>
                                    </span>
                                    <p className="text-md font-normal w-3/12 text-center">{destination}</p>
                    </div>
                    <p className="text-sm font-normal w-full text-left">Flight: {flightID}</p>
                    <p className="text-sm font-normal w-full text-left">Flight Date: {flightDate}</p>
                </div>
            </div>
            <div id="qrcode" className="w-3/12 p-2 flex justify-center items-center">
                <QRCode value={"name: " + name + ", origin: " + origin + ", destination: " + destination + ", seat: " + seat} size={128} />
            </div>
        </div>
    )
}

export default Ticket;