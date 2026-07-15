import React, { useState, useEffect, useRef } from 'react'

export const PrevCount = () => {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef(0);

    // Update the ref *after* rendering, capturing the previous count for the next render
    useEffect(() => {
        prevCountRef.current = count;
    }, [count]);

    return (
        <div style={{ padding: "10px 0" }}>
            <h2 style={{ marginBottom: "15px" }}>🔄 useRef Hook: Previous Value Tracker</h2>
            <p style={{ fontSize: "16px", margin: "15px 0" }}>
                Current Count: <strong style={{ color: "#0077ff", fontSize: "18px" }}>{count}</strong>
            </p>
            <p style={{ fontSize: "16px", margin: "15px 0", color: "#666" }}>
                Previous Count: <strong style={{ color: "#ff5e00", fontSize: "18px" }}>{prevCountRef.current}</strong>
            </p>
            <div className="btn-group" style={{ marginTop: "20px" }}>
                <button onClick={() => setCount(count + 1)}>Increment (+)</button>
                <button onClick={() => setCount(count - 1)}>Decrement (-)</button>
            </div>
        </div>
    );
};
