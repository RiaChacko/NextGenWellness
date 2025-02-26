import React, { useState } from "react";
import "../pages/Questionnaire.css";
import { Link } from "react-router-dom";

function Questionnaire() {
  // Personal info states (gender, bio-metrics)
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
<<<<<<< Updated upstream
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // Separate goals for each workout type
  const [cardioGoals, setCardioGoals] = useState([]);
  const [strengthGoals, setStrengthGoals] = useState([]);
  const [yogaGoals, setYogaGoals] = useState([]);

  const cardioGoalsList = ["Run 5K", "Lose Weight", "Improve Endurance"];
  const strengthGoalsList = ["Build Muscle", "Increase Strength", "Tone Body"];
  const yogaGoalsList = ["Improve Flexibility", "Reduce Stress", "Improve Posture"];
=======

  // State to track which workout’s form is open (for the right-side panel)
  const [activeWorkout, setActiveWorkout] = useState(null);
  // Store the saved goals for each workout (key: workout name, value: data object)
  const [workoutGoals, setWorkoutGoals] = useState({});
  // Temporary state for form inputs while editing
  const [tempGoals, setTempGoals] = useState({});

  // Define workouts for each category
  const cardioWorkouts = [
    "RUN",
    "WALK",
    "STAIRMASTER",
    "CYCLING",
    "SWIMMING",
    "ELLIPTICAL",
    "ROWING",
    "JUMP ROPE",
    "HIIT"
  ];
  const strengthWorkouts = [
    "BENCH PRESS",
    "INCLINE BENCH PRESS",
    "DUMBBELL CHEST PRESS",
    "OVERHEAD PRESS",
    "DUMBBELL SHOULDER PRESS",
    "DIPS",
    "PUSH UPS",
    "PULL UPS",
    "LAT PULLDOWNS",
    "BARBELL ROWS",
    "DUMBBELL ROWS",
    "SEATED CABLE ROWS",
    "FACE PULLS",
    "BICEPS CURLS",
    "SQUATS",
    "DEADLIFTS",
    "LEG PRESS",
    "LUNGES",
    "LEG EXTENSIONS",
    "CALF RAISES"
  ];
  const yogaWorkouts = [
    "VINYASA",
    "HATHA",
    "POWER",
    "YIN",
    "RESTORATIVE",
    "ASHTANGA"
  ];
>>>>>>> Stashed changes

  // Mapping of each exercise to its specific form fields
  const exerciseAttributes = {
    // Cardio workouts
    "RUN": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 30" },
      { key: "targetDistance", label: "Target Distance (km)", type: "number", placeholder: "e.g., 5" },
      { key: "targetPace", label: "Target Pace (min/km)", type: "number", placeholder: "e.g., 6" }
    ],
    "WALK": [
      { key: "steps", label: "Steps", type: "number", placeholder: "e.g., 10000" },
      { key: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g., 60" }
    ],
    "STAIRMASTER": [
      { key: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g., 20" },
      { key: "intensity", label: "Intensity Level", type: "number", placeholder: "e.g., 5" }
    ],
    "CYCLING": [
      { key: "distance", label: "Distance (km)", type: "number", placeholder: "e.g., 20" },
      { key: "avgSpeed", label: "Average Speed (km/h)", type: "number", placeholder: "e.g., 25" }
    ],
    "SWIMMING": [
      { key: "laps", label: "Laps", type: "number", placeholder: "e.g., 10" },
      { key: "distance", label: "Distance (meters)", type: "number", placeholder: "e.g., 100" }
    ],
    "ELLIPTICAL": [
      { key: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g., 30" },
      { key: "resistance", label: "Resistance Level", type: "number", placeholder: "e.g., 5" }
    ],
    "ROWING": [
      { key: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g., 20" },
      { key: "strokes", label: "Strokes per Minute", type: "number", placeholder: "e.g., 30" }
    ],
    "JUMP ROPE": [
      { key: "jumps", label: "Number of Jumps", type: "number", placeholder: "e.g., 200" },
      { key: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g., 10" }
    ],
    "HIIT": [
      { key: "rounds", label: "Number of Rounds", type: "number", placeholder: "e.g., 8" },
      { key: "workInterval", label: "Work Interval (seconds)", type: "number", placeholder: "e.g., 30" },
      { key: "restInterval", label: "Rest Interval (seconds)", type: "number", placeholder: "e.g., 15" }
    ],
    // Strength workouts
    "BENCH PRESS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 70" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "INCLINE BENCH PRESS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 60" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "DUMBBELL CHEST PRESS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 40" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 12" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "OVERHEAD PRESS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 50" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 8" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "DUMBBELL SHOULDER PRESS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 20" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "DIPS": [
      { key: "weight", label: "Added Weight (kg)", type: "number", placeholder: "e.g., 0" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 12" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "PUSH UPS": [
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 15" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "PULL UPS": [
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 8" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "LAT PULLDOWNS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 40" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "BARBELL ROWS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 70" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "DUMBBELL ROWS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 25" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "SEATED CABLE ROWS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 50" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "FACE PULLS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 15" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 12" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "BICEPS CURLS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 10" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 12" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "SQUATS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 100" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 8" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "DEADLIFTS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 120" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 5" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "LEG PRESS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 150" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 10" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "LUNGES": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 20" },
      { key: "reps", label: "Reps per leg", type: "number", placeholder: "e.g., 12" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "LEG EXTENSIONS": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 40" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 15" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    "CALF RAISES": [
      { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g., 50" },
      { key: "reps", label: "Reps", type: "number", placeholder: "e.g., 20" },
      { key: "sets", label: "Sets", type: "number", placeholder: "e.g., 3" }
    ],
    // Yoga workouts
    "VINYASA": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 30" },
      { key: "poses", label: "Number of Poses", type: "number", placeholder: "e.g., 5" }
    ],
    "HATHA": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 45" },
      { key: "frequency", label: "Frequency (days/week)", type: "number", placeholder: "e.g., 3" }
    ],
    "POWER": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 20" },
      { key: "intensity", label: "Intensity", type: "number", placeholder: "e.g., 7" }
    ],
    "YIN": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 40" },
      { key: "relaxation", label: "Relaxation Level", type: "number", placeholder: "e.g., 5" }
    ],
    "RESTORATIVE": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 50" },
      { key: "frequency", label: "Frequency (days/week)", type: "number", placeholder: "e.g., 2" }
    ],
    "ASHTANGA": [
      { key: "targetTime", label: "Target Time (minutes)", type: "number", placeholder: "e.g., 60" },
      { key: "sequences", label: "Number of Sequences", type: "number", placeholder: "e.g., 6" }
    ]
  };

  // Handle clicking on a workout button
  const handleWorkoutClick = (workout) => {
    if (activeWorkout === workout) {
      // Close the right panel if the same workout is clicked again
      setActiveWorkout(null);
      setTempGoals({});
    } else {
      // Open the right panel for the clicked workout
      setActiveWorkout(workout);
      if (workoutGoals[workout]) {
        // If we have saved goals, load them
        setTempGoals(workoutGoals[workout]);
      } else {
        // Otherwise, initialize empty fields for that workout
        if (exerciseAttributes[workout]) {
          const initialGoals = {};
          exerciseAttributes[workout].forEach((field) => {
            initialGoals[field.key] = "";
          });
          setTempGoals(initialGoals);
        } else {
          setTempGoals({});
        }
      }
    }
  };

  // Save the form data and close the panel
  const handleSave = () => {
    if (activeWorkout) {
      setWorkoutGoals((prev) => ({
        ...prev,
        [activeWorkout]: tempGoals
      }));
      setActiveWorkout(null);
      setTempGoals({});
    }
  };

  // Render the goal form or placeholder in the right panel
  const renderGoalContent = () => {
    if (!activeWorkout) {
      return (
        <div className="placeholder">
          <p>Please select an exercise</p>
        </div>
      );
    }
    const fields = exerciseAttributes[activeWorkout];
    if (!fields) return null;
    return (
      <div className="form-container">
        <h2 className="goals-header">SET GOALS FOR {activeWorkout}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {fields.map((field) => (
            <div key={field.key} className="form-field">
              <label>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={tempGoals[field.key] || ""}
                onChange={(e) =>
                  setTempGoals({ ...tempGoals, [field.key]: e.target.value })
                }
              />
            </div>
          ))}
          <button type="submit" className="save-button">SUBMIT</button>
        </form>
      </div>
    );
  };

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
  return (
    <div className="entire-page-q">
      {/* Sticky Top-right corner */}
      <div className="top-right-title">
        <h1>NEXT-GEN WELLNESS</h1>
      </div>

      {/* Main left panel */}
      <div className="left-panel">
        <h1 className="main-title">CONTINUE SETTING UP YOUR PROFILE</h1>

        {/* Gender Selection */}
        <div className="gender-section">
          <h3>SELECT YOUR GENDER:</h3>
          <div className="gender-buttons">
            <button
              className={`gender-btn ${gender === "female" ? "selected" : ""}`}
              onClick={() => setGender("female")}
            >
              FEMALE
            </button>
            <button
              className={`gender-btn-prefer ${gender === "prefer" ? "selected" : ""}`}
              onClick={() => setGender("prefer")}
            >
              PREFER NOT TO SAY
            </button>
            <button
              className={`gender-btn-male ${gender === "male" ? "selected" : ""}`}
              onClick={() => setGender("male")}
            >
              MALE
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bio-section">
          <h3>ENTER YOUR INFORMATION:</h3>
          <div className="bio-inputs">
            <input
              type="number"
              placeholder="HEIGHT (in)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="WEIGHT (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="AGE (yrs)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

<<<<<<< Updated upstream
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
=======
        {/* Workouts */}
        <div className="workouts-section">
          <h3>SELECT YOUR WORKOUTS:</h3>

          <h4 className="category-header">CARDIO:</h4>
          <div className="workout-buttons">
            {cardioWorkouts.map((workout) => (
              <button
                key={workout}
                className={`workout-btn cardio-btn ${workoutGoals[workout] ? "active" : ""}`}
                onClick={() => handleWorkoutClick(workout)}
              >
                {workout}
              </button>
            ))}
          </div>

          <h4 className="category-header">STRENGTH TRAINING:</h4>
          <div className="workout-buttons">
            {strengthWorkouts.map((workout) => (
              <button
                key={workout}
                className={`workout-btn ${workoutGoals[workout] ? "active" : ""}`}
                onClick={() => handleWorkoutClick(workout)}
              >
                {workout}
              </button>
            ))}
          </div>

          <h4 className="category-header">YOGA:</h4>
          <div className="workout-buttons">
            {yogaWorkouts.map((workout) => (
              <button
                key={workout}
                className={`workout-btn yoga-btn ${workoutGoals[workout] ? "active" : ""}`}
                onClick={() => handleWorkoutClick(workout)}
              >
                {workout}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Right panel */}
      <div className="right-panel">
        {renderGoalContent()}
      </div>

      {/* Fixed NEXT button (outside the form) */}
      <div className="next-btn-fixed">
        <Link to="/dashboard">
          <button className="next-btn">NEXT</button>
        </Link>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}

export default Questionnaire;
