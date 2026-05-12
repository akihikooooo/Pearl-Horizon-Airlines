import InputField from "../../components/InputField";
import "../stylesheets/payment.css";

function Payment() {
    return(
        <>
        <div id="cont" className="pt-16 w-full flex justify-center items-center flex-col gap-6">
            {/* <h1 className="text-3xl font-bold mb-4">Payment</h1> */}
            <p className="text-3xl text-horizon font-bold text-center ">Summary</p>
            <div id="summary "className=" w-9/12 rounded-md p-6 flex flex-col gap-4">
                <div className="header flex justify-content items-center font-bold">Flight Details</div>
                <div className="">
                </div>
            </div>
            {/* Add your payment form or components here */}
            {/* <InputField label="Card Number" type="text" placeholder="1234 5678 9012 3456" />
            <InputField label="Expiration Date" type="text" placeholder="MM/YY" />
            <InputField label="CVV" type="text" placeholder="123" />
            <button className="bg-horizon text-white px-4 py-2 rounded mt-4 hover:bg-horizon-dark transition-colors duration-300">Pay Now</button> */}
        </div>
        </>
    )
}

export default Payment;