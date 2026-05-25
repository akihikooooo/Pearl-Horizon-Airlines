function SelectionField({ label, options, disabled}){
    return(<div>
        <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">{label}</label>
        <select name={label} 
        className="bg-horizon-tint px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none focus:border-horizon transition-colors rounded-sm w-full">
        <option value="" disabled selected>
                                    {disabled}
                                </option>
            {options.map((option, index) => (
                <option key={index}>{option}</option>
            ))}
        </select>
    </div>)
}

export default SelectionField