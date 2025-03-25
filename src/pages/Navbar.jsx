import "../pages/Navbar.css";
import svglogod from "../assets/Icon.svg";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sync active tab based on current path
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("dashboard")) setActiveTab("dashboard");
    else if (path.includes("log-new-workout")) setActiveTab("log-new-workout");
    else if (path.includes("motivation")) setActiveTab("motivation");
    else if (path.includes("profile")) setActiveTab("profile");
    else if (path.includes("goals")) setActiveTab("goals");
    else if (path.includes("activities")) setActiveTab("activities");
    else if (path.includes("history")) setActiveTab("history");
  }, [location]);

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
        <Link
          to="/dashboard"
          className={activeTab === "dashboard" ? "active" : ""}
        >
          DASHBOARD
        </Link>
        <Link
          to="/log-new-workout"
          className={activeTab === "log-new-workout" ? "active" : ""}
        >
          LOG A WORKOUT
        </Link>
        <Link
          to="/motivation"
          className={activeTab === "motivation" ? "active" : ""}
        >
          MOTIVATION
        </Link>
        <Link
          to="/profile"
          className={activeTab === "profile" ? "active" : ""}
        >
          PROFILE
        </Link>
        <Link
          to="/goals"
          className={activeTab === "goals" ? "active" : ""}
        >
          GOAL-SETTING
        </Link>
        <Link
          to="/activities"
          className={activeTab === "activities" ? "active" : ""}
        >
          FITNESS PLAN
        </Link>
        <Link
          to="/history"
          className={activeTab === "history" ? "active" : ""}
        >
          USER HISTORY
        </Link>
      </div>
    </div>
  );
}

export default Navbar;