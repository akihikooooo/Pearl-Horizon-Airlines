function ErrorLabel({ message, error }) {
    return (error ? (<div className="w-full p-2 border-2 border-red-400 bg-red-300 flex justify-center items-center gap-2 text-red-900 font-medium">
            <span class="material-symbols-outlined">exclamation</span>
            {message}
        </div>) : <></>
        
    );
}

export default ErrorLabel;
