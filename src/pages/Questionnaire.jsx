import React, { useState } from "react";
import "../pages/Questionnaire.css";
import { Link } from "react-router-dom";

function Questionnaire() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("");

  const [cardioGoals, setCardioGoals] = useState({
    targetTime: "",
    targetSpeed: "",
    targetDistance: "",
  });
  const [strengthGoals, setStrengthGoals] = useState({
    targetTime: "",
    targetSpeed: "",
    targetDistance: "",
  });
  const [yogaGoals, setYogaGoals] = useState({
    targetTime: "",
    targetSpeed: "",
    targetDistance: "",
  });

//   const cardioGoalsList = ["Run 5K", "Lose Weight", "Improve Endurance"];
//   const strengthGoalsList = ["Build Muscle", "Increase Strength", "Tone Body"];
//   const yogaGoalsList = ["Improve Flexibility", "Reduce Stress", "Improve Posture"];

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleWorkoutSelect = (workout) => {
    setSelectedWorkouts((prev) =>
      prev.includes(workout) ? prev.filter((item) => item !== workout) : [...prev, workout]
    );
    setSelectedWorkoutType(workout);
  };

//   const handleFitnessGoalSelect = (goal, workoutType) => {
//     if (workoutType === "CARDIO") {
//       setCardioGoals((prev) => ({
//         ...prev,
//         [goal]: !prev[goal],
//       }));
//     } else if (workoutType === "STRENGTH") {
//       setStrengthGoals((prev) => ({
//         ...prev,
//         [goal]: !prev[goal],
//       }));
//     } else if (workoutType === "YOGA") {
//       setYogaGoals((prev) => ({
//         ...prev,
//         [goal]: !prev[goal],
//       }));
//     }
//   };

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
          <div className="specific-workout-s">
            <h4>CARDIO:</h4>
            {["RUN", "WALK", "STAIRMASTER"].map((workout) => (
              <button
                key={workout}
                className={`workout-button ${selectedWorkouts.includes(workout) ? "selected" : ""}`}
                onClick={() => handleWorkoutSelect(workout)}
              >
                {workout}
              </button>
            ))}
          </div>

          <div className="specific-workout-s">
            <h4>STRENGTH TRAINING:</h4>
            {["SQUATS", "BENCHPRESS", "PULLUPS"].map((workout) => (
              <button
                key={workout}
                className={`workout-button ${selectedWorkouts.includes(workout) ? "selected" : ""}`}
                onClick={() => handleWorkoutSelect(workout)}
              >
                {workout}
              </button>
            ))}
          </div>

          <div className="specific-workout-s">
            <h4>YOGA:</h4>
            {["VINYASA", "HATHA", "POWER"].map((workout) => (
              <button
                key={workout}
                className={`workout-button ${selectedWorkouts.includes(workout) ? "selected" : ""}`}
                onClick={() => handleWorkoutSelect(workout)}
              >
                {workout}
              </button>
            ))}
          </div>
        </div>

 
        {selectedWorkouts.length > 0 && (
          <div className="fitness-goals-container">
            {selectedWorkouts.includes("RUN") || selectedWorkouts.includes("WALK") || selectedWorkouts.includes("STAIRMASTER") ? (
              <div className="fitness-goal-section">
                <h3>SET GOALS FOR CARDIO:</h3>
                <form>
                  <div>
                    <label>Target Time:</label>
                    <input
                      type="number"
                      placeholder="e.g., 30"
                      value={cardioGoals.targetTime || ""}
                      onChange={(e) => setCardioGoals({ ...cardioGoals, targetTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Target Speed:</label>
                    <input
                      type="number"
                      placeholder="e.g., 8"
                      value={cardioGoals.targetSpeed || ""}
                      onChange={(e) => setCardioGoals({ ...cardioGoals, targetSpeed: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Target Distance:</label>
                    <input
                      type="number"
                      placeholder="e.g., 5"
                      value={cardioGoals.targetDistance || ""}
                      onChange={(e) => setCardioGoals({ ...cardioGoals, targetDistance: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            ) : null}

            {selectedWorkouts.includes("SQUATS") || selectedWorkouts.includes("BENCHPRESS") || selectedWorkouts.includes("PULLUPS") ? (
              <div className="fitness-goal-section">
                <h3>SET GOALS FOR STRENGTH TRAINING:</h3>
                <form>
                  <div>
                    <label>Target Time:</label>
                    <input
                      type="number"
                      placeholder="Ex: 80 kg"
                      value={strengthGoals.targetTime || ""}
                      onChange={(e) => setStrengthGoals({ ...strengthGoals, targetTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Lift Amount:</label>
                    <input
                      type="number"
                      placeholder="Ex: 4"
                      value={strengthGoals.targetSpeed || ""}
                      onChange={(e) => setStrengthGoals({ ...strengthGoals, targetSpeed: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Target Sets/Reps:</label>
                    <input
                      type="text"
                      placeholder="Ex: 3 sets of 10 reps"
                      value={strengthGoals.targetDistance || ""}
                      onChange={(e) => setStrengthGoals({ ...strengthGoals, targetDistance: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            ) : null}

            {selectedWorkouts.includes("VINYASA") || selectedWorkouts.includes("HATHA") || selectedWorkouts.includes("POWER") ? (
              <div className="fitness-goal-section">
                <h3>SET GOALS FOR YOGA:</h3>
                <form>
                  <div>
                    <label>Target Time:</label>
                    <input
                      type="number"
                      placeholder="Ex: 30 minutes"
                      value={yogaGoals.targetTime || ""}
                      onChange={(e) => setYogaGoals({ ...yogaGoals, targetTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Target Frequency:</label>
                    <input
                      type="number"
                      placeholder="e.g., 3 times a week"
                      value={yogaGoals.targetSpeed || ""}
                      onChange={(e) => setYogaGoals({ ...yogaGoals, targetSpeed: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Target Poses:</label>
                    <input
                      type="text"
                      placeholder="e.g. Warrior II Pose"
                      value={yogaGoals.targetDistance || ""}
                      onChange={(e) => setYogaGoals({ ...yogaGoals, targetDistance: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <Link to="/dashboard">
        <button className="pink-n">NEXT</button>
      </Link>
    </div>
  );
}

export default Questionnaire;
