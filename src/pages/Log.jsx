import React, { useEffect, useState } from "react";
import "../pages/Log.css";
import Navbar from "./Navbar";
import { 
    doc, 
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    Timestamp
  } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, db } from "./firebaseConfig";
import footsteps from "../assets/footsteps-icon.svg";
import scale from "../assets/scale-icon.svg";

function Log() {
    const [showStepsForm, setShowStepsForm] = useState(false);
    const [showWeightForm, setShowWeightForm] = useState(false);
    const [userGoals, setUserGoals] = useState({ cardio: [], strength: [], yoga: [] });
    const [formValues, setFormValues] = useState({});
    const [steps, setSteps] = useState("");
    const [weight, setWeight] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getData = onAuthStateChanged(auth, async (currentUser) => {
                        if (currentUser) {
                            setUser(currentUser);
                            try {
                                const goalDoc = await getDoc(doc(db, "userGoals", currentUser.uid));
                                if (goalDoc.exists()) {
                                    const goalData = goalDoc.data()["goals"];
                                    const goalsObject = Object.keys(goalData)
                                    .filter(key => key.startsWith("goals."))
                                        .reduce((obj, key) => {
                                            obj[key] = goalData[key];
                                            return obj;
                                        }, {});
                                    const goalsArray = Object.values(goalsObject);
                                     
                                    const organizedGoals = { cardio: [], strength: [], yoga: [] };

                                    goalsArray.forEach((goal) => {
                                        if (goal.category && organizedGoals[goal.category]) {
                                            organizedGoals[goal.category].push(goal);
                                        }
                                    });

                                    setUserGoals(organizedGoals);
                                }

                            } catch (error) {
                                console.error("There was an error fetching user data:", error);
                            }
                        } else {
                            console.error("No authenticated user found.");
                        }
                    });
        return () => getData();
      }, []);

    const handleStepsInputChange = (e) => {
        setSteps(e.target.value);
    };
    const handleWeightInputChange = (e) => {
        setWeight(e.target.value);
    };

    const handleStepsSubmit = async (e) => {
        e.preventDefault();
        const newSteps = parseInt(steps, 10);

        if (!user || isNaN(newSteps) || newSteps <= 0) {
            console.error("Invalid input or no user logged in");
            return;
        }
        const userId = user.uid;
        const now = new Date();
        const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayISO = localDate.toISOString().split("T")[0]; 
        const docId = `${userId}-${todayISO}`;

        try {

            const userDocRef = doc(db, "users", userId);
            const userSnap = await getDoc(userDocRef);
            const userData = userSnap.data();

            const heightMeters = (userData.height / 39.37); 
            const weightKgs = (userData.weight * 0.453592);
            const stride = (heightMeters * 0.414);
            const distance = stride * newSteps;
            const time = (distance/1.4);
            const calories = (time * 3.8 * 3.5 * weightKgs/(200 * 60)).toFixed(2);
            const docRef = doc(db, "activities", docId);
            const docSnap = await getDoc(docRef);

            const newActivity = {
                activityType: "Steps",
                timestamp: Timestamp.now(),
                steps: newSteps,
                caloriesBurned: Number(calories)
            };

            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    activities: arrayUnion(newActivity)
                });
            } else {
                await setDoc(docRef, {
                    userId: user.uid,
                    activities: [newActivity] 
                });
            }

            const historyDocRef = doc(db, "userHistory", userId);
            const historyDocSnap = await getDoc(historyDocRef);

            const newHistory = {
                item: "Steps Count",
                type: "Step",
                user: userData.name,
                date: new Date().toISOString(),
                details: `Steps: ${newSteps}, Calories burned: ${calories}`
            }

            if (historyDocSnap.exists()) {
                await updateDoc(historyDocRef, {
                    history: arrayUnion(newHistory)
                });
            } else {
                await setDoc(historyDocRef, {
                    userId: user.uid,
                    history: [newHistory] 
                });
            }

            setSteps("");
            }
            catch (error) {
                console.error("Error saving steps: ", error);
            }
    };

    const handleWeightSubmit = async (e) => {
        e.preventDefault();
        const newWeight = parseInt(weight, 10);

        if (!user || isNaN(newWeight) || newWeight <= 0) {
            console.error("Invalid input or no user logged in");
            return;
        }

        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data();
        const prevWeight = userData.weight;

        let weightChange = newWeight - prevWeight;
        const weightDescriptor = weightChange >= 0 ?  "up" : "down";
        weightChange = Math.abs(weightChange);
        
            try {
              await setDoc(
                doc(db, "users", userId),
                { weight: newWeight },
                { merge: true }
              );

            const historyDocRef = doc(db, "userHistory", userId);
            const historyDocSnap = await getDoc(historyDocRef);

            const newHistory = {
                item: "Recorded Weight",
                type: "Weight",
                user: userData.name,
                date: new Date().toISOString(),
                details: `Logged new weight of ${newWeight}lb, ${weightDescriptor} ${weightChange}lb from last log`
            }

            if (historyDocSnap.exists()) {
                await updateDoc(historyDocRef, {
                    history: arrayUnion(newHistory)
                });
            } else {
                await setDoc(historyDocRef, {
                    userId: user.uid,
                    history: [newHistory] 
                });
            }

              setWeight("");
            }
            catch (error) {
                console.error("Error saving weight: ", error);
                window.alert("Error saving your weight. Please try again.");
              }
    };

    const handleInputChange = (exerciseName, key, value) => {
        setFormValues((prev) => ({
            ...prev,
            [exerciseName]: {
                ...prev[exerciseName],
                [key]: value
            }
        }));
    };

    const calculateCalories = (category, attributes, weightKg) => {
        const MET_VALUES = {
            cardio: 8.0,
            yoga: 3.0,
            strength: 2.5,
        };
    
        const met = MET_VALUES[category.toLowerCase()] || 1.0;
        let durationMins = 0;
    
        const timeFields = ["duration", "time", "Duration", "Time"];
        for (const field of timeFields) {
            if (attributes[field]) {
                durationMins = parseFloat(attributes[field]);
                break;
            }
        }
    
        if ((!durationMins || isNaN(durationMins)) && attributes.Distance) {
            const distance = parseFloat(attributes.Distance);
            const distanceUnit = (attributes["Distance Unit"] || "km").toLowerCase(); 
    
            const distanceKm = distanceUnit === "miles" ? distance * 1.60934 : distance;
    
            durationMins = distanceKm * 6;
        }

        if (!durationMins || isNaN(durationMins)) {
            if (attributes.Reps) {
                durationMins = parseFloat(attributes.Reps) * 0.5;
            } else if (attributes["Number of Rounds"]) {
                durationMins = parseFloat(attributes["Number of Rounds"]) * 5;
            } else {
                durationMins = 15; 
            }
        }
    
        const durationHours = durationMins / 60;
        return Math.round(met * weightKg * durationHours);
    };
    
    const handleSubmit = async (e, goal) => {
        e.preventDefault();

        if (!user) {
            console.error("No user logged in");
            return;
        }
        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data();

        const now = new Date();
        const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayISO = localDate.toISOString().split("T")[0];
        const docId = `${userId}-${todayISO}`;

        const attributes = formValues[goal.exerciseName] || goal.attributes;

        const hasEmptyFields = Object.values(attributes).some(value => !value || value.trim() === "");

        if (hasEmptyFields) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            const timestamp = Timestamp.now();
            const docRef = doc(db, "activities", docId);
            const docSnap = await getDoc(docRef);

            const duration = parseFloat(attributes.duration);
            const weightKg = parseFloat(userData?.weight); 

            const caloriesBurned = calculateCalories(goal.category, duration, weightKg);

    
            if (docSnap.exists()) {
                const newActivity = {
                    activityType: goal.exerciseName,
                    timestamp,
                    attributes,
                    caloriesBurned,
                };
    
                await updateDoc(docRef, {
                    activities: arrayUnion(newActivity) 
                });
            } else {
                await setDoc(docRef, {
                    userId: user.uid,
                    activities: [
                        {
                            activityType: goal.exerciseName,
                            timestamp,
                            attributes,
                            caloriesBurned,
                        }
                    ]
                });
            }
            
            const historyDocRef = doc(db, "userHistory", userId);
            const historyDocSnap = await getDoc(historyDocRef);
            const attributeDetails = Object.entries(attributes)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", "); 

            const newHistory = {
                item: `Recorded ${goal.category.charAt(0).toUpperCase() + goal.category.slice(1)} Workout`,

                type: "Workout",
                user: userData.name,
                date: new Date().toISOString(),
                details: `Logged ${goal.exerciseName} with ${attributeDetails}`
            }

            if (historyDocSnap.exists()) {
                await updateDoc(historyDocRef, {
                    history: arrayUnion(newHistory)
                });
            } else {
                await setDoc(historyDocRef, {
                    userId: user.uid,
                    history: [newHistory] 
                });
            }

            setFormValues(prev => ({
                ...prev,
                [goal.exerciseName]: Object.fromEntries(
                    Object.keys(attributes).map(key => [key, ""]) 
                )
            }));
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
 
    const toggleStepsForm = () => setShowStepsForm(!showStepsForm);
    const toggleWeightForm = () => setShowWeightForm(!showWeightForm);

    const [expanded, setExpanded] = useState({});

    const toggleExpand = (exerciseName) => {
        setExpanded((prev) => ({
            ...prev,
            [exerciseName]: !prev[exerciseName],
        }));
    };

    return (
        <div>
            <Navbar />
            <div className="log-container">
                <h1>LOG DATA AND WORKOUTS</h1>

                <h2 className="log-workout-title">LOG A WORKOUT</h2>
                <div className="log-workout">
                    
                {userGoals ? "" : <h3>Add goals to log progress!</h3>}

                {Object.entries(userGoals).map(([category, exercises]) => (
                    exercises.length > 0 && (
                        <div key={category} className={`log-${category}`}>
                            <h3>{category.toUpperCase()}</h3>
                            {exercises.map((goal, index) => (
                                <div key={index} className="goal-item">
                                    <button
                                        className="expand-btn"
                                        onClick={() => toggleExpand(goal.exerciseName)}
                                    >
                                        {goal.exerciseName.toUpperCase()}
                                    </button>

                                    {expanded[goal.exerciseName] && (
                                        <form className="goal-form" onSubmit={(e) => handleSubmit(e, goal)}>
                                            {Object.entries(goal.attributes).map(([key, value]) => (
                                                <div key={key} className="form-group">
                                                    <label>{key}:</label>
                                                    <input 
                                                        type="text" 
                                                        value={formValues[goal.exerciseName]?.[key] || ""}
                                                        onChange={(e) => handleInputChange(goal.exerciseName, key, e.target.value)}
                                                    />

                                                </div>
                                            ))}

                                            <button type="submit">Submit</button>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </div>
                    )))}
                </div>

                <h2 className="log-other-title">LOG OTHER DATA</h2>
                <div className="log-other">
                    <button onClick={toggleStepsForm}>
                        <img className="footsteps-icon" src={footsteps} alt="steps" />
                        STEPS
                    </button>
                    <button onClick={toggleWeightForm}>
                        <img className="scale-icon" src={scale} alt="weight" />
                        WEIGHT
                    </button>
                </div>

                {showStepsForm && (
                    <div className="steps-form">
                        <h4>Log Steps</h4>
                        <form onSubmit={handleStepsSubmit}>
                            <label>Steps Taken:</label>
                            <input
                                type="number"
                                value={steps}
                                onChange={handleStepsInputChange}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}

                {showWeightForm && (
                    <div className="weight-form">
                        <h4>Log Weight</h4>
                        <form onSubmit={handleWeightSubmit}>
                            <label>Weight (lbs):</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={handleWeightInputChange}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Log;
