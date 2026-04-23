import { NavLink } from "react-router-dom";

function Signup() {
    return(
        <>
            <div id="cont" className="flex justify-center items-center w-screen h-screen bg-horizon-tint">
                <div id="field" className="p-14 bg-sky-cloud flex justify-center items-center flex-col rounded-md shadow-2xl">
                    <div className="text-base md:text-2xl font-bold text-center leading-none">
                        Pearl <span className="text-horizon">Horizon</span> Airline <br/>
                        Signup
                    </div>
                    <form onSubmit={1+1}id="form" className="flex flex-col gap-2 p-2">
                        <input />
                        <BookingField label="E-mail" type="text" placeholder="johndoe@email.com"/>
                        <BookingField label="Password" type="password" placeholder=""/>
                        <button className="bg-horizon w-full rounded-md">Log-in</button>
                    </form>
                    <p>Have an account? <NavLink to="/accounts/login"className="text-horizon">Log in.</NavLink></p>
                </div>
            </div>
        </>
    )
}

const BookingField = ({ label, ...inputProps }) => (
  <div>
    <label className="block text-sm font-semibold md:tracking-[0.15em] text-horizon uppercase mb-1.5">
      {label}
    </label>
    <input
      {...inputProps}
      name={label}
      className="md:text-sm w-full bg-sky-cloud border border-sky-slate px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm"
    />
  </div>
);

export default Signup;