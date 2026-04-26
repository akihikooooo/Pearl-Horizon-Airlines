import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../index.css";
import "./stylesheets/booking.css"
import "./stylesheets/search.css";

const InputField = ({ label, ...inputProps }) => (
  <div className="w-full">
    <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">
      {label}
    </label>
    <input
      {...inputProps}
      name={label}
      className="md:text-sm w-full bg-sky-cloud border border-sky-slate px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm"
    />
  </div>
);

const RenderPassenger = ({ index, data, onChange }) => {
  const [selectedgender,setselectedGender] = useState(null);
  return (
    <div id="passenger-cont" className="border rounded-md w-9/12 mx-2 my-4 p-2">
      <div id="passenger-header">
        <p className="flex items-center font-bold">Passenger {index}</p>
      </div>
      <div id="passenger-details">
        <div id="name" className="flex gap-2 md:items-center flex-col md:flex-row">
          <div id="title" className="name">
            <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">Title</label>
            <select
              value={data.title}
              onChange={e => onChange("title", e.target.value)}
              required
              className="w-full md:text-sm bg-sky-cloud border border-sky-slate px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm"
            >
              <option value="" disabled>-Select your title-</option>
              <option value="mr">Mr.</option>
              <option value="ms">Ms.</option>
              <option value="mrs">Mrs.</option>
            </select>
          </div>
          <InputField label="First Name" placeholder="Juan" type="text" className="" required/>
          <InputField label="Last Name" placeholder="Dela Cruz" type="text" required/>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            {["Male", "Female"].map((gender) => {
              return(
                <button className={`flex justify-center items-center gap-1 font-medium ${selectedgender == gender ? "text-horizon" : ""}`} onClick={()=>{
                  setselectedGender(gender);
                  console.log(gender);
                  console.log(selectedgender)}}>
                  <div className={`h-3 w-3 border rounded-full ${selectedgender == gender ? "bg-horizon border-transparent" : ""}`}></div>
                  {gender}
                </button>
              )
            })}
          </div>
          <div>
            <InputField label="Date of Birth" type="date"/>
          </div>
        </div>
      </div>
      <div id="contact-details">
        <p className="flex items-center font-medium"> Contact Information </p>
        <div className="flex gap-2 md:items-center flex-col md:flex-row">
          <InputField label="Email" placeholder="juandelacruz@email.com" type="email" required/>
          <InputField label="Phone Number" placeholder="+63 912 345 6789" type="tel" required/>
          </div>
        </div>
      <div id="emergency-details">
        <p className="flex items-center font-medium"> Emergency Contact Information </p>
        <div className="flex gap-2 md:items-center flex-col md:flex-row">
          <InputField label="Emergency Contact Name" placeholder="Marcelo Aguncillo" type="text" required/>
          <InputField label="Phone Number" placeholder="+63 912 345 6789" type="tel" required/>
          </div>
        </div>
    </div>
  );
};

function Booking() {
  const [searchParams] = useSearchParams();
  const passengerCount = parseInt(searchParams.get('passengers')) || 1;

  const [passengerData, setPassengerData] = useState(
    Array.from({ length: passengerCount }, () => ({ title: "" }))
  );

  const updatePassenger = (index, field, value) => {
    setPassengerData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(passengerData)); // swap this for your API call later
  };

  return (
    <div id="cont" className="pt-14">
      <div id="header" className="md:px-20 py-2 md:py-10">
        <h1 className="md:text-4xl text-horizon font-semibold flex items-center justify-center md:tracking-wider">
          Booking Information
        </h1>
      </div>
      <div id="render" className="flex flex-col justify-center items-center">
        {Array.from({ length: passengerCount }, (_, i) => (
  <RenderPassenger
    key={i}
    index={i + 1}
    data={passengerData[i]}
    onChange={(field, value) => updatePassenger(i, field, value)}
  />
))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Booking;