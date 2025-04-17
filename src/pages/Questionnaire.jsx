import React, { useEffect, useState } from "react";
import "../pages/Questionnaire.css";
import { useNavigate } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  getDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebaseConfig";

function Questionnaire() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [groupedWorkouts, setGroupedWorkouts] = useState({});

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutGoals, setWorkoutGoals] = useState({});
  const [tempGoals, setTempGoals] = useState({});

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      setTempGoals(workoutGoals[workout.id] || {});
    }
  };

  const handleSave = async () => {
    if (!activeWorkout || !user) {
      console.error("Workout or user missing");
      return;
    }

    setWorkoutGoals((prev) => ({
      ...prev,
      [activeWorkout.id]: tempGoals,
    }));
  
    const userId = user.uid;
  
    const goal = {
      exerciseName: activeWorkout.name,
      category: activeWorkout.category,
      attributes: tempGoals,
      submittedAt: new Date().toISOString(),
    };
  
    const userDocRef = doc(db, "userGoals", userId);
  
    try {
      const currentSnapshot = await getDoc(userDocRef);
      const currentData = currentSnapshot.exists() ? currentSnapshot.data() : {};
  
      const updatedData = {
        ...currentData,
        goals: {
          ...(currentData.goals || {}),
          [`goals.${activeWorkout.id}`]: goal,
        },
      };
  
      await setDoc(userDocRef, updatedData);
      console.log("Goal saved successfully");
  
      setActiveWorkout(null);
      setTempGoals({});
    } catch (error) {
      console.error("Error saving goal: ", error);
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

  const handleNext = async () => {
    if (!height || !weight || !birthdate) {
      window.alert("Please complete all personal information fields (height, weight, and birthdate).");
      return;
    }
    if (!user) {
      window.alert("User not signed in");
      return;
    }

    const userId = user.uid;
    try {
      await setDoc(
        doc(db, "users", userId),
        {
          ...(gender && { gender }), 
          height,
          weight,
          birthdate
        },
        { merge: true }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving user info: ", error);
      window.alert("Error saving your profile. Please try again.");
    }
  };

  const orderedCategories = ["yoga", "cardio", "strength"];

  return (
    <div className="entire-page-q">
      <div className="top-right-title">
        <h1>NEXT-GEN WELLNESS</h1>
      </div>

      <div className="left-panel">
        <h1 className="main-title">CONTINUE SETTING UP YOUR PROFILE</h1>

        <div className="bio-section">
          <h3>
            ENTER YOUR INFORMATION: <span className="field-required">(Required)</span>
          </h3>
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
              type="text"
              placeholder="BIRTHDATE (mm/dd/yyyy)"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
        </div>

        <div className="gender-section">
          <h3>
            SELECT YOUR GENDER: <span className="field-optional">(Optional)</span>
          </h3>
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

        <div className="workouts-section">
          <h3>
            SELECT YOUR WORKOUTS: <span className="field-optional">(Optional)</span>
          </h3>
          {orderedCategories.map((category) => {
            if (!groupedWorkouts[category]) return null;
            return (
              <div key={category}>
                <h4 className="category-header">{category.toUpperCase()}:</h4>
                <div className="workout-buttons">
                  {groupedWorkouts[category].map((workout) => (
                    <button
                      key={workout.id}
                      className={`workout-btn ${workout.category.toLowerCase()} ${activeWorkout?.id === workout.id || workoutGoals[workout.id] ? "active" : ""}`}
                      onClick={() => handleWorkoutClick(workout)}
                    >
                      {workout.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="right-panel">{renderGoalContent()}</div>

      <div className="next-btn-fixed">
        <button className="next-btn" onClick={handleNext}>
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Questionnaire;
