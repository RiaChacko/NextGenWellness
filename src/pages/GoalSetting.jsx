import React, { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Plus } from "lucide-react";
import Navbar from '../pages/Navbar.jsx';
import "./GoalSetting.css";

const categories = [
  { title: "Cardio", goals: 4, color: "bg-pink" },
  { title: "Strength Training", goals: 3, color: "bg-blue" },
  { title: "Yoga", goals: 4, color: "bg-gray" },
];

const GoalSetting = () => {
  const [goalList, setGoalList] = useState(categories);

  return (
    <div className="goal-setting-container">
      <Navbar />
      <div className="main-content">
        {/* Sidebar */}
        {/* <aside className="sidebar">
          <h2 className="highlight-pink">NEXT-GEN</h2>
          <h2 className="highlight-blue">WELLNESS</h2>
          <nav>
            <a href="#">DASHBOARD</a>
            <a href="#">LOG NEW WORKOUT</a>
            <a href="#">MOTIVATION</a>
            <a href="#">PROFILE</a>
            <a href="#" className="active">SET GOALS</a>
          </nav>
          <div className="profile">
            <img src="/bob_ross.jpg" alt="Bob Ross" />
            <span>BOB ROSS</span>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="goal-main">
          <h1>FITNESS GOALS</h1>
          {goalList.map((category) => (
            <section key={category.title} className="category-section">
              <h2>{category.title}</h2>
              <div className="goal-grid">
                {[...Array(category.goals)].map((_, index) => (
                  <Card key={index} className={`goal-card ${category.color}`}>
                    <div className="card-content">
                      <h3>RUNNING GOAL</h3>
                      <p>60 minutes</p>
                      <p>5 mph</p>
                      {index % 2 === 0 && (
                        <Button variant="secondary" size="sm">EDIT</Button>
                      )}
                    </div>
                  </Card>
                ))}
                <Card className="add-goal-card">
                  <Plus size={32} />
                </Card>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default GoalSetting;
