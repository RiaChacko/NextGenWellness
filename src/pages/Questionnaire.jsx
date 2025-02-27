import React, { useEffect, useState } from "react";
import "../pages/Questionnaire.css";
import { Link } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebaseConfig";

function Questionnaire() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [groupedWorkouts, setGroupedWorkouts] = useState({});

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutGoals, setWorkoutGoals] = useState({});
  const [tempGoals, setTempGoals] = useState({});

  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const querySnapshot = await getDocs(collection(db, "workouts"));
      const workoutsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkouts(workoutsData);

      const grouped = workoutsData.reduce((acc, workout) => {
        const category = workout.category.trim().toLowerCase();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(workout);
        return acc;
      }, {});
      setGroupedWorkouts(grouped);
    };

    fetchWorkouts();
  }, []);

  const handleWorkoutClick = (workout) => {
    if (activeWorkout && activeWorkout.id === workout.id) {
      setActiveWorkout(null);
      setTempGoals({});
    } else {
      setActiveWorkout(workout);
      if (workoutGoals[workout.id]) {
        setTempGoals(workoutGoals[workout.id]);
      } else {
        if (workout.trackingAttributes) {
          const initialGoals = {};
          workout.trackingAttributes.forEach((field) => {
            initialGoals[field.key] = "";
          });
          setTempGoals(initialGoals);
        } else {
          setTempGoals({});
        }
      }
    }
  };

  const handleSave = async () => {
    if (activeWorkout) {
      setWorkoutGoals((prev) => ({
        ...prev,
        [activeWorkout.id]: tempGoals,
      }));

      if (!user) {
        console.error("User is not signed in");
        return;
      }
      
      const userId = user.uid; 

      const goal = {
        exerciseName: activeWorkout.name,
        attributes: tempGoals,
        submittedAt: new Date().toISOString()
      };

      const userDocRef = doc(db, "userGoals", userId);
      try {
        await setDoc(
          userDocRef,
          {
            userId,
            [`goals.${activeWorkout.id}`]: goal
          },
          { merge: true }
        );
        console.log("Goal saved successfully");
      } catch (error) {
        console.error("Error saving goal: ", error);
      }

      setActiveWorkout(null);
      setTempGoals({});
    }
  };

  const renderGoalContent = () => {
    if (!activeWorkout) {
      return (
        <div className="placeholder">
          <p>Please select an exercise</p>
        </div>
      );
    }
    const fields = activeWorkout.trackingAttributes;
    if (!fields) return null;
    return (
      <div className="form-container">
        <h2 className="goals-header">SET GOALS FOR {activeWorkout.name}</h2>
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
          <button type="submit" className="save-button">
            SUBMIT
          </button>
        </form>
      </div>
    );
  };

  const orderedCategories = ["yoga", "cardio", "strength"];

  return (
    <div className="entire-page-q">
      <div className="top-right-title">
        <h1>NEXT-GEN WELLNESS</h1>
      </div>

      <div className="left-panel">
        <h1 className="main-title">CONTINUE SETTING UP YOUR PROFILE</h1>

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

        <div className="workouts-section">
          <h3>SELECT YOUR WORKOUTS:</h3>
          {orderedCategories.map((category) => {
            if (!groupedWorkouts[category]) return null;
            return (
              <div key={category}>
                <h4 className="category-header">{category.toUpperCase()}:</h4>
                <div className="workout-buttons">
                  {groupedWorkouts[category].map((workout) => {
                    // A button is styled as active if it is either currently selected
                    // or if a goal has already been set for that workout.
                    const isActive = (activeWorkout && activeWorkout.id === workout.id) || workoutGoals[workout.id];
                    return (
                      <button
                        key={workout.id}
                        className={`workout-btn ${workout.category.toLowerCase()} ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() => handleWorkoutClick(workout)}
                      >
                        {workout.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="right-panel">{renderGoalContent()}</div>

      <div className="next-btn-fixed">
        <Link to="/dashboard">
          <button className="next-btn">NEXT</button>
        </Link>
      </div>
    </div>
  );
}

export default Questionnaire;
