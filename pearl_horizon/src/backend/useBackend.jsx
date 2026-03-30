import { createContext, useContext } from "react";

export const BackendContext = createContext(null);

export default function useBackend() {
    const context = useContext(BackendContext);
    return context;
}

export class Backend {
    constructor() {
        // this class shall be a singleton
        if (Backend.instance) {
            return Backend.instance;
        }
        Backend.instance = this;
    }
    searchFlights(e) {
        e.preventDefault()
        console.log("meow")
    }
}
