import "../pages/Navbar.css";
import svglogod from "../assets/Icon.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

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
        <Link to="/log-new-workout"><a
          onClick={() => handleTabSelect("log-new-workout")}
          className={activeTab === "log-new-workout" ? "active" : ""}
        >
          LOG A WORKOUT
        </a>
        </Link>
        <Link to="/motivation">
        <a
          onClick={() => handleTabSelect("motivation")}
          className={activeTab === "motivation" ? "active" : ""}
        >
          MOTIVATION
        </a>
        </Link>
        <Link to="/profile">
        <a
          onClick={() => handleTabSelect("profile")}
          className={activeTab === "profile" ? "active" : ""}
        >
          PROFILE
        </a>
        </Link>
        <Link to="/goals">
        <a
          onClick={() => handleTabSelect("goals")}
          className={activeTab === "goals" ? "active" : ""}
        >
          GOAL-SETTING
        </a>
        </Link>
        <Link to="/activities">
        <a
          onClick={() => handleTabSelect("activities")}
          className={activeTab === "activities" ? "active" : ""}
        >
          FITNESS PLAN
        </a>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;