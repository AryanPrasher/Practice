import React, { useState } from "react";
import "./App.css";
import Home from "./Home";
import UseState from "./Hooks/UseState";
import UseEffect from "./Hooks/UseEffect";
import { Useref } from "./Hooks/Useref";
import { PrevCount } from "./Hooks/PrevCount";
import Register from "./Hooks/Register";
import Father from "./Props/Father";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useGlobal } from "./ContextAPI/Golbalvariable";

function App() {
  
  {
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/useState" element={<UseState />} />
        <Route path="/useEffect" element={<UseEffect />} />
        <Route path="/useref" element={<Useref />} />
        <Route path="/prevcount" element={<PrevCount />} />
        <Route path="/register" element={<Register />} />
        <Route path="/father" element={<Father />} />
      </Routes>
    </BrowserRouter>
  };
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "state":
        return <UseState />;
      case "effect":
        return <UseEffect />;
      case "refFocus":
        return <Useref />;
      case "refPrev":
        return <PrevCount />;
      case "register":
        return <Register />;
      case "props":
        return <Father />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Learning Workshop</h1>
        <p className="app-subtitle">Interactive examples of React hooks and props</p>
      </header>

      <nav className="tab-nav">
        <button className={activeTab === "home" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("home")}>🏠 Home</button>
        <button className={activeTab === "state" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("state")}>🔑 useState</button>
        <button className={activeTab === "effect" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("effect")}>⚡ useEffect</button>
        <button className={activeTab === "refFocus" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("refFocus")}>🎯 useRef Focus</button>
        <button className={activeTab === "refPrev" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("refPrev")}>🔄 useRef Prev</button>
        <button className={activeTab === "register" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("register")}>📝 Form</button>
        <button className={activeTab === "props" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("props")}>👨 Props</button>
      </nav>

      <main className="container">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;