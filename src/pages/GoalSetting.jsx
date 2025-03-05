import React, { useEffect, useState } from "react";
import Navbar from "../pages/Navbar.jsx";
import Card from "../components/Card";
import Button from "../components/Button";
import { Plus } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import "./GoalSetting.css";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const GoalSetting = () => {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState({});
  const [editedGoals, setEditedGoals] = useState({});

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
    setEditedGoals((prev) => ({
      ...prev,
      [goalKey]: {
        attributes: { ...(goalData.attributes || {}) },
      },
    }));
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
      const exerciseName = originalWorkout.exerciseName;

      docData[goalKey] = {
        attributes: editedGoalData.attributes,
        exerciseName: exerciseName,
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
                const { attributes = {}, exerciseName } = goalData;

                return (
                  <Card key={goalKey} className="goal-card">
                    <div className="card-content">
                      <h3>{capitalize(exerciseName || displayName)}</h3>
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
            <Card className="add-goal-card">
              <Plus size={32} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GoalSetting;
