import React, { useState } from "react";
import "../pages/Questionnaire.css";
import { Link } from "react-router-dom";

function Questionnaire() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // Separate goals for each workout type
  const [cardioGoals, setCardioGoals] = useState([]);
  const [strengthGoals, setStrengthGoals] = useState([]);
  const [yogaGoals, setYogaGoals] = useState([]);

  const cardioGoalsList = ["Run 5K", "Lose Weight", "Improve Endurance"];
  const strengthGoalsList = ["Build Muscle", "Increase Strength", "Tone Body"];
  const yogaGoalsList = ["Improve Flexibility", "Reduce Stress", "Improve Posture"];

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleWorkoutSelect = (workout) => {
    setSelectedWorkouts((prev) =>
      prev.includes(workout) ? prev.filter((item) => item !== workout) : [...prev, workout]
    );
  };

  const handleFitnessGoalSelect = (goal, workoutType) => {
    if (workoutType === "cardio") {
      setCardioGoals((prev) =>
        prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
      );
    } else if (workoutType === "strength") {
      setStrengthGoals((prev) =>
        prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
      );
    } else if (workoutType === "yoga") {
      setYogaGoals((prev) =>
        prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
      );
    }
  };

  return (
    <div className="entire-page-q">
      <div className="center-q title-q">
        <h1 className="pink-q">NEXT-GEN&nbsp;</h1>
        <h1 className="blue-q">WELLNESS</h1>
      </div>
      <h1 className="title2">CONTINUE SETTING UP YOUR PROFILE</h1>
      <div className="whole-content">
        <h3>SELECT YOUR GENDER:</h3>
        <div className="gender-choices">
          <button
            className={`female ${gender === "female" ? "f-selected" : ""}`}
            onClick={() => handleGenderSelect("female")}
          >
            FEMALE
          </button>
          <button
            className={`male ${gender === "male" ? "m-selected" : ""}`}
            onClick={() => handleGenderSelect("male")}
          >
            MALE
          </button>
          <button
            className={`prefer ${gender === "prefer" ? "p-selected" : ""}`}
            onClick={() => handleGenderSelect("prefer")}
          >
            PREFER NOT TO SAY
          </button>
        </div>

        <h3>PERSONAL INFORMATION:</h3>
        <div className="bio-metrics">
          <input
            type="number"
            placeholder="HEIGHT IN CM"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="WEIGHT IN KG"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="AGE IN YRS"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <h3>SELECT YOUR WORKOUT(S):</h3>
        <div className="workout-choices">
          {["cardio", "strength", "yoga"].map((workout) => (
            <button
              key={workout}
              className={`workout-button ${selectedWorkouts.includes(workout) ? "selected" : ""}`}
              onClick={() => handleWorkoutSelect(workout)}
            >
              {workout.charAt(0).toUpperCase() + workout.slice(1)}
            </button>
          ))}
        </div>

        {/* Fitness Goals container appears when any workouts are selected */}
        {(selectedWorkouts.length > 0) && (
          <div className="fitness-goals-container">
            {selectedWorkouts.includes("cardio") && (
              <div className="fitness-goal-section">
                <h3>Fitness Goals for Cardio:</h3>
                {cardioGoalsList.map((goal) => (
                  <button
                    key={goal}
                    className={`goal-button ${cardioGoals.includes(goal) ? "goal-selected" : ""}`}
                    onClick={() => handleFitnessGoalSelect(goal, "cardio")}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            )}
            {selectedWorkouts.includes("strength") && (
              <div className="fitness-goal-section">
                <h3>Fitness Goals for Strength:</h3>
                {strengthGoalsList.map((goal) => (
                  <button
                    key={goal}
                    className={`goal-button ${strengthGoals.includes(goal) ? "goal-selected" : ""}`}
                    onClick={() => handleFitnessGoalSelect(goal, "strength")}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            )}
            {selectedWorkouts.includes("yoga") && (
              <div className="fitness-goal-section">
                <h3>Fitness Goals for Yoga:</h3>
                {yogaGoalsList.map((goal) => (
                  <button
                    key={goal}
                    className={`goal-button ${yogaGoals.includes(goal) ? "goal-selected" : ""}`}
                    onClick={() => handleFitnessGoalSelect(goal, "yoga")}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
     <Link to="/dashboard"> <button className="pink-n">Next</button></Link>
    </div>
  );
}

export default Questionnaire;
