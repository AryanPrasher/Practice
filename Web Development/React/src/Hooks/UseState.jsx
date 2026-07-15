import { useState } from "react";

const UseState = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputPassword, setInputPassword] = useState("");

    return (
        <div style={{ padding: "10px 0", textAlign: "left" }}>
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>🔑 useState Hook: State Toggle</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", textAlign: "center" }}>
                Toggle password visibility dynamically by updating a boolean state variable.
            </p>
            
            <div style={{ position: "relative" }}>
                <input 
                    type={showPassword ? "text" : "password"} 
                    value={inputPassword} 
                    onChange={(e) => setInputPassword(e.target.value)} 
                    placeholder="Type a password..."
                    style={{
                        paddingRight: "80px",
                        margin: 0,
                    }}
                />
                <button 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "6px 12px",
                        fontSize: "13px",
                        background: "#0077ff",
                        borderRadius: "6px",
                    }}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            
            {inputPassword && (
                <div style={{ 
                    marginTop: "15px", 
                    padding: "10px", 
                    background: "#f1f5f9", 
                    borderRadius: "6px", 
                    fontSize: "13px", 
                    color: "#334155", 
                    borderLeft: "4px solid #0077ff" 
                }}>
                    <strong>Actual state value:</strong> <code style={{ color: "#0f172a" }}>{inputPassword}</code>
                </div>
            )}
        </div>
    );
};

export default UseState;