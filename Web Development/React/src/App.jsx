import { useState } from "react";
import "./App.css";
import Home from "./Home";
import UseState from "./Hooks/UseState";
import UseEffect from "./Hooks/UseEffect";
import { Useref } from "./Hooks/Useref";
import { PrevCount } from "./Hooks/PrevCount";
import Register from "./Hooks/Register";
import Father from "./Props/Father";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    if (activeTab === "state") return <UseState />;
    if (activeTab === "effect") return <UseEffect />;
    if (activeTab === "refFocus") return <Useref />;
    if (activeTab === "refPrev") return <PrevCount />;
    if (activeTab === "register") return <Register />;
    if (activeTab === "props") return <Father />;
    return <Home />;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Learning Workshop</h1>
        <p className="app-subtitle">Interactive examples of React hooks and props</p>
      </header>

      <nav className="tab-nav" aria-label="Learning examples">
        <button className={activeTab === "home" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("home")}>Home</button>
        <button className={activeTab === "state" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("state")}>useState</button>
        <button className={activeTab === "effect" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("effect")}>useEffect</button>
        <button className={activeTab === "refFocus" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("refFocus")}>useRef Focus</button>
        <button className={activeTab === "refPrev" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("refPrev")}>useRef Previous</button>
        <button className={activeTab === "register" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("register")}>Form</button>
        <button className={activeTab === "props" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("props")}>Props</button>
      </nav>

      <main className="container">{renderContent()}</main>
    </div>
  );
}

export default App;
