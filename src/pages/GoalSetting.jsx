import React, { useEffect, useState } from "react";
import Navbar from "../pages/Navbar.jsx";
import Card from "../components/Card";
import Button from "../components/Button";
import { Plus } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  getDocs
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import "./GoalSetting.css";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const GoalSetting = () => {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState({});
  const [editedGoals, setEditedGoals] = useState({});
  const [showNewGoalUI, setShowNewGoalUI] = useState(false);
  const [newGoalAttributes, setNewGoalAttributes] = useState({});
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [tempGoals, setTempGoals] = useState({});
  

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchWorkouts = async () => {
      const all = [];
      try {
        const collectionSnap = await getDocs(collection(db, "workouts")); // fetch all workouts from workouts collection
        const all = collectionSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableWorkouts(all);
        setAvailableWorkouts(all);
      } 
      
      catch (error) {
        console.error("Error fetching workouts:", error);
      }

    };
    fetchWorkouts();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "userGoals", user.uid); // fetch user goals from userGoals collection
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoals(data.goals || data);
      } else {
        setGoals({});
      }
    });
    return () => unsubscribe();
  }, [user]);

  // edit goal button: set the editedGoals state with the goalKey and goalData
  const handleEdit = (goalKey, goalData) => {
    setEditedGoals((prev) => ({
      ...prev,
      [goalKey]: {
        attributes: { ...(goalData.attributes || {}) },
      },
    }));
  };

  const handleNewGoal = () => {
    setShowGoalModal(true);
  };

  // save new goal data to the database
  const handleSaveNewGoal = async () => {
    if (!user || !selectedWorkout) return;
  
    try {
      const docRef = doc(db, "userGoals", user.uid);
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {}; 
  
      // create a new goal object
      const goalData = {
        attributes: tempGoals,
        exerciseName: selectedWorkout.name || "Unnamed Workout", 
        category: selectedWorkout.category || "Uncategorized",
        submittedAt: new Date().toISOString(),
      };
  
      const goalKey = `goals.${selectedWorkout.id}`;
      const updatedData = {
        ...currentData,
        goals: {
          ...(currentData.goals || {}),
          [goalKey]: goalData,
        },
      };
  
      await setDoc(docRef, updatedData);
      setShowGoalModal(false);
      setSelectedWorkout(null);
      setTempGoals({}); 
    } catch (err) {
      console.error("Failed to save new goal:", err);
    }
  };
  
  // save edited goal data to the database
  const handleSave = async (goalKey) => {
    const editedGoalData = editedGoals[goalKey];
    if (!editedGoalData) return;
    try {
      const docRef = doc(db, "userGoals", user.uid);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.exists() ? docSnap.data() : {};
  
      const originalWorkout = goals[goalKey] || {};
      const exerciseName = originalWorkout.exerciseName;
  
      const updatedGoal = {
        attributes: editedGoalData.attributes,
        exerciseName,
        category: originalWorkout.category,
        submittedAt: new Date().toISOString(),
      };
  
      const updatedData = {
        ...docData,
        goals: {
          ...(docData.goals || {}),
          [goalKey]: updatedGoal,
        },
      };
  
      await setDoc(docRef, updatedData);
  
      setEditedGoals((prev) => {
        const newState = { ...prev };
        delete newState[goalKey];
        return newState;
      });
    } catch (error) {
      console.error("Error updating goal:", goalKey, error);
    }
  };

  // handle the change in the input fields for the goal attributes
  const handleAttributeChange = (goalKey, attrKey, value) => {
    setEditedGoals((prev) => ({
      ...prev,
      [goalKey]: {
        ...prev[goalKey],
        attributes: {
          ...prev[goalKey].attributes,
          [attrKey]: value,
        },
      },
    }));
  };

  // form to create a new goal; will be displayed when the user clicks on the add new goal button  
  const GoalForm = ({ activeWorkout, handleSave }) => {
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
          <button type="submit" className="save-button">SUBMIT</button>
        </form>
      </div>
    );
  };
  

  return (
    <div className="goal-setting-container">
      <Navbar />
      <div className="main-content">
        <main className="goal-main">
          <h1>FITNESS GOALS</h1>
          <div className="goal-grid"> {/* Added a grid layout for the goals */}
            {Object.keys(goals).length === 0 ? (
              <p>No goals available.</p>

            ) : (
              Object.entries(goals).map(([goalKey, goalData]) => {
                if (goalKey === "userId") return null;
                if (!goalKey.startsWith("goals.")) return null;

                const displayName = goalKey.slice("goals.".length);
                const isEditing = editedGoals.hasOwnProperty(goalKey);
                const { attributes = {}, name } = goalData;

                return (
                  <Card key={goalKey} className="goal-card"> {/* From Card class; displays goal attrs and allows editing */}
                    <div className="card-content">
                      <h3>{capitalize(name || displayName)}</h3>
                      {isEditing ? (
                        Object.entries(attributes).map(([attrKey, attrValue]) => (
                          <p key={attrKey}>
                            <strong>{capitalize(attrKey)}:</strong>{" "}
                            <input
                              type="text"
                              value={
                                editedGoals[goalKey].attributes[attrKey] ||
                                ""
                              }
                              onChange={(e) =>
                                handleAttributeChange(
                                  goalKey,
                                  attrKey,
                                  e.target.value
                                )
                              }
                            />
                          </p>
                        ))
                      ) : (
                        Object.entries(attributes).map(([attrKey, attrValue]) => (
                          <p key={attrKey}>
                            <strong>{capitalize(attrKey)}:</strong> {attrValue}
                          </p>
                        ))
                      )}
                      {isEditing ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSave(goalKey)}
                        >
                          SAVE
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(goalKey, goalData)}
                        >
                          EDIT
                        </Button>
                        
                      )}
                    </div>
                  </Card>
                );
              })
            )}

            <div className="add-goal-card">
                <Card className="add-goal">
                  <div className = "add-new-goal" style={{ display: "flex", justifyContent: "center", cursor : "pointer" }}>
                    <Button onClick={handleNewGoal}>
                      <Plus size={16} />
                    </Button>
                  </div>
              </Card>
            </div>
          </div>
        </main>
        {showGoalModal && (
          <div className="modal-overlay">
            <div className="modal-content">
            <h2 style={{ fontSize: "1.5rem", fontFamily: "'Lexend Mega', sans-serif", marginBottom: "1rem" }}>
          Create New Goal
        </h2>
              <label>Select a workout:</label>
              <select
              value={selectedWorkout?.id || ""}
              onChange={(e) => {
                const workout = availableWorkouts.find(w => w.id === e.target.value);
                setSelectedWorkout(workout);
                setShowGoalModal(true); 
              }}
            >
              <option value="">-</option>
              {availableWorkouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>


              <div className="modal-buttons">
              <Button
                variant="secondary"
                onClick={() => {
                  if (!selectedWorkout) return alert("Please select a workout");
                  handleSaveNewGoal();
                  setShowGoalModal(false);
                  setSelectedWorkout(null);
                }}
              >
                Save Goal
              </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoalModal(false);
                    setSelectedWorkout(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
              {showGoalModal && selectedWorkout && (
        <div className="modal-overlay">
          <div className="modal-content">
            <GoalForm
              activeWorkout={selectedWorkout}
              handleSave={handleSaveNewGoal}
            />
            <div className="modal-buttons">
              <Button
                variant="outline"
                onClick={() => {
                  setShowGoalModal(false);
                  setSelectedWorkout(null);
                  setTempGoals({});
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default GoalSetting;
