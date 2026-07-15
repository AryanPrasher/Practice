import React, { useState, useEffect } from 'react'

const UseEffect = () => {
    const [count, setCount] = useState(0);
    const [logs, setLogs] = useState([]);

    // useEffect runs whenever the dependencies in the array (count) change
    useEffect(() => {
        // 1. Update the document title (side effect)
        document.title = `Count: ${count}`;

        // 2. Add an event log (side effect)
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prevLogs) => [
            `[${timestamp}] Count updated to ${count}`,
            ...prevLogs.slice(0, 4) // Keep the 5 most recent logs
        ]);
    }, [count]); // Dependency array: triggers the effect whenever count changes

    return (
        <div style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#1e1e2e",
            color: "#cdd6f4",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            maxWidth: "350px",
            margin: "20px auto"
        }}>
            <h2 style={{ color: "#89b4fa", marginTop: 0, fontSize: "20px" }}>⚡ useEffect Demo</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span>Counter: <strong style={{ fontSize: "18px", color: "#f9e2af" }}>{count}</strong></span>
                <button 
                    onClick={() => setCount((prev) => prev + 1)}
                    style={{
                        padding: "8px 16px",
                        background: "#89b4fa",
                        color: "#11111b",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "all 0.2s"
                    }}
                >
                    Increment
                </button>
            </div>

            <div style={{ background: "#181825", padding: "12px", borderRadius: "8px" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#f38ba8", fontSize: "13px" }}>📡 Side Effects Log</h4>
                <div style={{ fontSize: "11px", fontFamily: "monospace", minHeight: "100px", lineHeight: "1.4" }}>
                    {logs.length === 0 ? (
                        <div style={{ color: "#a6adc8" }}>Initializing...</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} style={{ color: index === 0 ? "#a6e3a1" : "#a6adc8", marginBottom: "4px" }}>
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default UseEffect