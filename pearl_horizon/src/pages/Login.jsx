import { useState } from "react";

function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    function submitCredentials() {
      
    }
    return (
        <div className="mt-30">
            <label>
                Username
                <input value={user} onChange={(e) => setUser(e.target.value)}/>
            </label>

            <label>
                Password
                <input value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>

            <button onClick={submitCredentials}>Log in</button>
        </div>
    );
}

export default Login;
