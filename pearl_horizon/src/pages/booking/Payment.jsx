import InputField from "../../components/InputField";
import "../stylesheets/payment.css";

function TextFields({ styles, start, middle, end }) {
    return (
        <>
            <div className={`w-full flex justify-between items-center ${styles}`}>
                <h1 className="text-md font-bold w-3/12">{start}</h1>
                {/* <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" /> */}
                <p className="text-md font-normal w-3/12 text-center">{middle}</p>
                {/* <span className="flex-1 w-full border-t-2 border-dotted border-horizon-deep" /> */}
                <p className="text-md font-normal w-3/12 text-right">{end}</p>
            </div>
        </>
    );
}

function PaymentView(){
    
}

function Payment() {

    const travelqty = 2;
    const sandwichqty = 2;
    const drinksqty = 2;
    const snacksqty = 2;
    const travelPrice = 30.00;
    const sandwichPrice = 30.00;
    const drinksPrice = 15.00;
    const snacksPrice = 20.00;
    const totalPrice = travelPrice + sandwichPrice + drinksPrice + snacksPrice;

    return (
        <>
            <div id="cont" className="pt-16 w-full flex justify-center items-center flex-col gap-6">
                {/* <h1 className="text-3xl font-bold mb-4">Payment</h1> */}
                <p className="text-3xl text-horizon font-bold text-center ">Summary</p>
                <div id="summary " className=" w-6/12 rounded-md p-6 flex flex-col gap-4">
                    <div className="w-full bg-sky-cloud flex flex-col justify-between rounded-lg p-2">
                        <h1 id="header" className="header font-medium flex gap-6 items-center justify-between">
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                            Flight Details
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                        </h1>
                            <TextFields styles="" start="Flight ID:" end="PH1234" />
                            <TextFields styles="" start="Booking ID:" end="1" />
                            <TextFields styles="" start="Trip Type:" end="Roundtrip" />
                            <TextFields styles="" start="Passenger Number:" end="1" />
                    </div>
                    <div className="w-full bg-sky-cloud flex flex-col justify-between rounded-lg p-2">
                        <h1 id="header" className="header font-medium flex gap-6 items-center justify-between">
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                            Payment Summary
                            <span className="flex-1 w-3/12 border-t-2 border border-horizon-deep" />
                        </h1>
                            <TextFields styles="" start="Flight Ticket" middle={travelqty} end={travelPrice * travelqty} />
                            <h1 id="header" className="header font-medium flex gap-6 items-center justify-center    ">
                            Add-ons
                        </h1>
                            <TextFields styles="" start="Sandwich" middle={sandwichqty} end={sandwichPrice * sandwichqty} />
                            <TextFields styles="" start="Drinks" middle={drinksqty} end={drinksPrice * drinksqty} />
                            <TextFields styles="" start="Snacks" middle={snacksqty} end={snacksPrice * snacksqty} />
                    </div>
                    <div className="w-full bg-sky-cloud flex flex-col justify-between rounded-lg p-2">
                            <TextFields styles="" start="Grand Total" end={totalPrice} />
                    </div>
                </div>
                <button className="bg-horizon text-sky-white px-4 py-2 rounded-lg">
                    Proceed to Payment
                </button>
            </div>
        </>
    );
}

export default Payment;

{
    /* Add your payment form or components here */
}
{
    /* <InputField label="Card Number" type="text" placeholder="1234 5678 9012 3456" />
<InputField label="Expiration Date" type="text" placeholder="MM/YY" />
<InputField label="CVV" type="text" placeholder="123" />
<button className="bg-horizon text-white px-4 py-2 rounded mt-4 hover:bg-horizon-dark transition-colors duration-300">Pay Now</button> */
}
