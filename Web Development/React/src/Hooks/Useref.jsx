import React, { useState, useEffect, useRef } from "react";

export const Useref = () => {
    const inputRef = useRef(null);
    const renderCount = useRef(1);
    const [text, setText] = useState("");

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Track total renders of this component (without triggering re-renders)
    useEffect(() => {
        renderCount.current += 1;
    });

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    const handleClickNav = (page) => {
        alert(`Navigated to ${page} (Action simulated via custom function)`);
    };

    return (
        <div style={{ padding: "10px 0", textAlign: "left" }}>
            <h2 style={{ textAlign: "center", marginBottom: "15px" }}>🎯 useRef Hook: Focus & Render Counter</h2>
            
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px", textAlign: "center" }}>
                This panel has rendered <strong style={{ color: "#0077ff" }}>{renderCount.current}</strong> times.
                <br />
                <span style={{ fontSize: "12px", color: "#888" }}>(Notice that typing updates state, causing re-renders. But storing values in `useRef` persists the data without triggering re-renders!)</span>
            </p>

            <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#444" }}>Simulated Navigation:</span>
                <nav className="navbar" style={{ marginTop: "8px" }}>
                    <button onClick={() => handleClickNav("Home")}>Home</button>
                    <button onClick={() => handleClickNav("About")}>About</button>
                    <button onClick={() => handleClickNav("Contact")}>Contact</button>
                </nav>
            </div>

            <div style={{ margin: "20px 0" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#444" }}>Interactive Input (Focuses automatically):</label>
                <input
                    type="text"
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type to trigger re-renders..."
                />
            </div>

            <div className="btn-group">
                <button onClick={handleFocus}>Focus Input Field</button>
            </div>
        </div>
    );
};
