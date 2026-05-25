export const InputField = ({labelshow, label, className, error, ...inputProps }) => (
    <div>
        <label className={`block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5 ${labelshow?"block":"hidden"}`}>{label}</label>
        <input
            {...inputProps}
            name={inputProps.name ? inputProps.name : label}
            className={`${className} md:text-sm w-full bg-horizon-tint border ${error ? "border-red-500 focus:border-red-500" : "border-sky-slate focus:border-horizon"} px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none transition-colors rounded-sm`}
        />
    </div>
);

export const SelectField = ({ label, children, className, name, ...inputProps }) => (
    <div>
        <label className="block text-[0.65rem] font-semibold md:tracking-[0.15em] text-sky-slate uppercase mb-1.5">{label}</label>
        <select
            name={name}
            className={`md:text-sm w-full bg-horizon-tint border border-sky-slate focus:border-horizon px-3.5 py-2.5 text-sky-night text-xs placeholder:text-sky-slate/60 outline-none transition-colors rounded-sm ${className}`}
            defaultValue=""
            {...inputProps}>
            {children}
        </select>
    </div>
);
