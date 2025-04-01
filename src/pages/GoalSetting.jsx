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
  // const [availableWorkouts, setAvailableWorkouts] = useState([]);
  // const [selectedWorkout, setSelectedWorkout] = useState(null);
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
        console.log("Inside try")
        const collectionSnap = await getDocs(collection(db, "workouts"));
        // collectionSnap.forEach(doc => {
        //   all.push({ id: doc.id, ...doc.data() });
        // });
        const all = collectionSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableWorkouts(all);
        console.log("Fetched workouts:", all);
        setAvailableWorkouts(all);
      } 
      
      catch (error) {
        console.log("Workouts:", all);
        console.error("Error fetching workouts:", error);
      }

    };
    fetchWorkouts();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "userGoals", user.uid);
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

  const handleEdit = (goalKey, goalData) => {
    console.log("Clicked!");
    setEditedGoals((prev) => ({
      ...prev,
      [goalKey]: {
        attributes: { ...(goalData.attributes || {}) },
      },
    }));
  };

  const handleNewGoal = () => {
    // setShowNewGoalUI(true);
    console.log("Create new goal clicked");
    setShowGoalModal(true);
  };
  
  
  const handleAddGoal = async () => {
    if (!selectedWorkout || !user) return;
  
    const docRef = doc(db, "userGoals", user.uid);
    const goalId = `goals.${selectedWorkout.id}`; // Consistent key naming
  
    const newGoal = {
      exerciseName: selectedWorkout.name,
      category: selectedWorkout.category,
      attributes: selectedWorkout.trackingAttributes.reduce((acc, attr) => {
        acc[attr.key] = attr.placeholder || "";
        return acc;
      }, {}),
      submittedAt: new Date().toISOString(),
    };
  
    try {
      const existingDoc = await getDoc(docRef);
      const data = existingDoc.exists() ? existingDoc.data() : {};
      const updatedData = {
        ...data,
        [goalId]: newGoal,
      };
  
      await setDoc(docRef, updatedData);
      setShowGoalModal(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error("Error adding new goal:", error);
    }
  };
  

const handleSaveNewGoal = async () => {
  if (!user || !selectedWorkout) return;

  try {
      const docRef = doc(db, "userGoals", user.uid);
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {}; // ✅ Define `currentData` first

      const goalData = {
          attributes: selectedWorkout.trackingAttributes.reduce((acc, attr) => {
              acc[attr.key] = attr.placeholder || "";
              return acc;
          }, {}),
          exerciseName: selectedWorkout.name || "Unnamed Workout", // ✅ Ensure valid value
          category: selectedWorkout.category || "Uncategorized",
          submittedAt: new Date().toISOString(),
      };

      const goalKey = `goals.${selectedWorkout.id}`;
      const updatedData = {
          ...currentData,
          goals: {
              ...(currentData.goals || {}),
              // [selectedWorkout.id]: goalData,
              [goalKey]: goalData,
          },
      };

      await setDoc(docRef, updatedData);
      setShowGoalModal(false);
      setSelectedWorkout(null);
      setTempGoals({}); // Reset form after save
  } catch (err) {
      console.error("Failed to save new goal:", err);
  }
};


  const handleSave = async (goalKey) => {
    const editedGoalData = editedGoals[goalKey];
    if (!editedGoalData) return;
    try {
      const docRef = doc(db, "userGoals", user.uid);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data() || {};

      delete docData[goalKey];

      const originalWorkout = goals[goalKey] || {};
      const name = originalWorkout.name;

      docData[goalKey] = {
        attributes: editedGoalData.attributes,
        name: name,
        category: originalWorkout.category,
        submittedAt: new Date().toISOString(),
      };

      await setDoc(docRef, docData);

      setEditedGoals((prev) => {
        const newState = { ...prev };
        delete newState[goalKey];
        return newState;
      });
    } catch (error) {
      console.error("Error updating goal:", goalKey, error);
    }
  };

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
          <div className="goal-grid">
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
                  <Card key={goalKey} className="goal-card">
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
                setShowGoalModal(true); // Open the second modal
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
                    handleSaveNewGoal(selectedWorkout);
                    handleAddGoal(selectedWorkout);
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
