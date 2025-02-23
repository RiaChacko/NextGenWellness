import "../pages/Navbar.css";
import svglogod from "../assets/Icon.svg";
import { useState } from "react";

function Navbar() {
 
  const [activeTab, setActiveTab] = useState("dashboard");

 
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="n-background">
      <div className="logo-name-d">
        <img src={svglogod} alt="logo" />
        <div className="title-da">
          <h1 className="pink-da">NEXT-GEN&nbsp;</h1>
          <h1 className="blue-da">WELLNESS</h1>
        </div>
      </div>
      <div className="nav-links-dash">
        <a
          href="/dashboard"
          onClick={() => handleTabSelect("dashboard")}
          className={activeTab === "dashboard" ? "active" : ""}
        >
          DASHBOARD
        </a>
        <a
          href="/log-new-workout"
          onClick={() => handleTabSelect("log-new-workout")}
          className={activeTab === "log-new-workout" ? "active" : ""}
        >
          LOG NEW WORKOUT
        </a>
        <a
          href="/motivation"
          onClick={() => handleTabSelect("motivation")}
          className={activeTab === "motivation" ? "active" : ""}
        >
          MOTIVATION
        </a>
        <a
          href="/profile"
          onClick={() => handleTabSelect("profile")}
          className={activeTab === "profile" ? "active" : ""}
        >
          PROFILE
        </a>
      </div>
    </div>
  );
}

export default Navbar;
