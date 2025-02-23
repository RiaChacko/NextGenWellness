import React, { useState } from "react";
import "../pages/Questionnaire.css";

function Questionnaire() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [selectSpecificWorkout, setselectSpecificWorkout] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleWorkoutSelect = (workout) => {
    
    setSelectedWorkout(selectedWorkout === workout ? "" : workout);
    setFitnessGoal(""); 
    setselectSpecificWorkout(""); 
  };

  const handleFitnessGoalSelect = (goal) => {
    
    setFitnessGoal(fitnessGoal === goal ? "" : goal);
  };

  const handleSpecificWorkoutSelect = (specificWorkout) => {
 
    setselectSpecificWorkout(selectSpecificWorkout === specificWorkout ? "" : specificWorkout);
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
        <h3>SELECT YOUR WORKOUT:</h3>
        <div className="workout-choices">
          <button
            className={`workout-button ${selectedWorkout === "cardio" ? "selected" : ""}`}
            onClick={() => handleWorkoutSelect("cardio")}
          >
            Cardio
          </button>
          <button
            className={`workout-button ${selectedWorkout === "strength" ? "selected" : ""}`}
            onClick={() => handleWorkoutSelect("strength")}
          >
            Strength
          </button>
          <button
            className={`workout-button ${selectedWorkout === "yoga" ? "selected" : ""}`}
            onClick={() => handleWorkoutSelect("yoga")}
          >
            Yoga
          </button>
        </div>

        {selectedWorkout && (
          <div className="specific-workouts">
            <h3>SELECT YOUR SPECIFIC WORKOUTS FOR {selectedWorkout.toUpperCase()}:</h3>
            {selectedWorkout === "cardio" && (
              <div>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Running" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Running")}
                >
                  Running
                </button>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Cycling" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Cycling")}
                >
                  Cycling
                </button>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Elliptical" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Elliptical")}
                >
                  Elliptical
                </button>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Walking" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Walking")}
                >
                  Walking
                </button>
              </div>
            )}
            {selectedWorkout === "strength" && (
              <div>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Weight Lifting" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Weight Lifting")}
                >
                  Weight Lifting
                </button>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Bodyweight Exercises" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Bodyweight Exercises")}
                >
                  Bodyweight Exercises
                </button>
              </div>
            )}
            {selectedWorkout === "yoga" && (
              <div>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Vinyasa" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Vinyasa")}
                >
                  Vinyasa
                </button>
                <button
                  className={`specific-w-button ${selectSpecificWorkout === "Hatha" ? "specific-w-button-selected" : ""}`}
                  onClick={() => handleSpecificWorkoutSelect("Hatha")}
                >
                  Hatha
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show the fitness goals container only when a specific workout is selected */}
        {selectSpecificWorkout && (
          <div className="fitness-goals-container">
            <h3>SET YOUR FITNESS GOALS FOR {selectSpecificWorkout.toUpperCase()}:</h3>
            <button
              className={`goal-button ${fitnessGoal === "Run 5K" ? "goal-selected" : ""}`}
              onClick={() => handleFitnessGoalSelect("Run 5K")}
            >
              Run 5K
            </button>
            <button
              className={`goal-button ${fitnessGoal === "Lose Weight" ? "goal-selected" : ""}`}
              onClick={() => handleFitnessGoalSelect("Lose Weight")}
            >
              Lose Weight
            </button>
            <button
              className={`goal-button ${fitnessGoal === "Build Muscle" ? "goal-selected" : ""}`}
              onClick={() => handleFitnessGoalSelect("Build Muscle")}
            >
              Build Muscle
            </button>
            <button
              className={`goal-button ${fitnessGoal === "Increase Strength" ? "goal-selected" : ""}`}
              onClick={() => handleFitnessGoalSelect("Increase Strength")}
            >
              Increase Strength
            </button>
            <button
              className={`goal-button ${fitnessGoal === "Improve Flexibility" ? "goal-selected" : ""}`}
              onClick={() => handleFitnessGoalSelect("Improve Flexibility")}
            >
              Improve Flexibility
            </button>
            <button
              className={`goal-button ${fitnessGoal === "Reduce Stress" ? "goal-selected" : ""}`}
              onClick={() => handleFitnessGoalSelect("Reduce Stress")}
            >
              Reduce Stress
            </button>
          </div>
        )}
      </div>
      <button className="goal-button pink-n">Next</button>
    </div>
  );
}

export default Questionnaire;
