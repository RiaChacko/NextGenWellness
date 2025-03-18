import React, { useEffect, useState } from "react";
import "../pages/Log.css";
import Navbar from "./Navbar";
import { 
    doc, 
    setDoc,
    getDoc,
    serverTimestamp,
    increment
  } from "firebase/firestore";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { db } from "./firebaseConfig";
import footsteps from "../assets/footsteps-icon.svg";
import scale from "../assets/scale-icon.svg";

function Log() {

    const [showTreadmillForm, setShowTreadmillForm] = useState(false);
    const [showStairmasterForm, setShowStairmasterForm] = useState(false);
    const [showSquatsForm, setShowSquatsForm] = useState(false);
    const [showLatPulldownsForm, setShowLatPulldownsForm] = useState(false);
    const [showBicepCurlsForm, setShowBicepCurlsForm] = useState(false);
    const [showSitUpsForm, setShowSitUpsForm] = useState(false);
    const [showYoga1Form, setShowYoga1Form] = useState(false); 
    const [showYoga2Form, setShowYoga2Form] = useState(false); 
    const [showStepsForm, setShowStepsForm] = useState(false);
    const [showWeightForm, setShowWeightForm] = useState(false);

    
    const [treadmillData, setTreadmillData] = useState({ duration: "", calories: "" });
    const [stairmasterData, setStairmasterData] = useState({ duration: "", calories: "" });
    const [squatsData, setSquatsData] = useState({ reps: "", weight: "" });
    const [latPulldownsData, setLatPulldownsData] = useState({ reps: "", weight: "" });
    const [bicepCurlsData, setBicepCurlsData] = useState({ reps: "", weight: "" });
    const [sitUpsData, setSitUpsData] = useState({ reps: "" });
    const [yoga1Data, setYoga1Data] = useState({ time: "" });  
    const [yoga2Data, setYoga2Data] = useState({ time: "" });  
    const [steps, setSteps] = useState("");
    const [weight, setWeight] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
      }, []);

    const handleTreadmillChange = (e) => {
        const { name, value } = e.target;
        setTreadmillData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleStairmasterChange = (e) => {
        const { name, value } = e.target;
        setStairmasterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSquatsChange = (e) => {
        const { name, value } = e.target;
        setSquatsData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLatPulldownsChange = (e) => {
        const { name, value } = e.target;
        setLatPulldownsData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBicepCurlsChange = (e) => {
        const { name, value } = e.target;
        setBicepCurlsData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSitUpsChange = (e) => {
        setSitUpsData({ reps: e.target.value });
    };

    const handleYoga1Change = (e) => {
        setYoga1Data({ time: e.target.value });
    };

    const handleYoga2Change = (e) => {
        setYoga2Data({ time: e.target.value });
    };

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
        const today = new Date().toISOString().split("T")[0]; 
        const docId = `${userId}-${today}`;

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

              await setDoc(doc(db, "activities", docId), {
                userId: user.uid,
                activityType: "Steps",
                timestamp: serverTimestamp(),
                steps: increment(newSteps),
                caloriesBurned: increment(calories)
              },
              { merge: true }
            );
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
            try {
              await setDoc(
                doc(db, "users", userId),
                { weight: newWeight },
                { merge: true }
              );
              setWeight("");
            }
            catch (error) {
                console.error("Error saving weight: ", error);
                window.alert("Error saving your weight. Please try again.");
              }
    };

    const toggleTreadmillForm = () => setShowTreadmillForm(!showTreadmillForm);
    const toggleStairmasterForm = () => setShowStairmasterForm(!showStairmasterForm);
    const toggleSquatsForm = () => setShowSquatsForm(!showSquatsForm);
    const toggleLatPulldownsForm = () => setShowLatPulldownsForm(!showLatPulldownsForm);
    const toggleBicepCurlsForm = () => setShowBicepCurlsForm(!showBicepCurlsForm);
    const toggleSitUpsForm = () => setShowSitUpsForm(!showSitUpsForm);
    const toggleYoga1Form = () => setShowYoga1Form(!showYoga1Form);
    const toggleYoga2Form = () => setShowYoga2Form(!showYoga2Form);  
    const toggleStepsForm = () => setShowStepsForm(!showStepsForm);
    const toggleWeightForm = () => setShowWeightForm(!showWeightForm);

    return (
        <div>
            <Navbar />
            <div className="log-container">
                <h1>LOG DATA AND WORKOUTS</h1>

                <h2 className="log-workout-title">LOG A WORKOUT</h2>
                <div className="log-workout">
                    <div className="log-cardio">
                        <h3>CARDIO</h3>
                        <button onClick={toggleTreadmillForm}>TREADMILL</button>
                        <button onClick={toggleStairmasterForm}>STAIRMASTER</button>
                    </div>

                    {showTreadmillForm && (
                        <div className="treadmill-form">
                            <h4>Log Treadmill Data</h4>
                            <form>
                                <label>Duration (in minutes):</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={treadmillData.duration}
                                    onChange={handleTreadmillChange}
                                    required
                                />
                                <label>Calories Burned:</label>
                                <input
                                    type="number"
                                    name="calories"
                                    value={treadmillData.calories}
                                    onChange={handleTreadmillChange}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    {showStairmasterForm && (
                        <div className="stairmaster-form">
                            <h4>Log Stairmaster Data</h4>
                            <form>
                                <label>Duration (in minutes):</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={stairmasterData.duration}
                                    onChange={handleStairmasterChange}
                                    required
                                />
                                <label>Calories Burned:</label>
                                <input
                                    type="number"
                                    name="calories"
                                    value={stairmasterData.calories}
                                    onChange={handleStairmasterChange}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    <div className="log-strength">
                        <h3>STRENGTH TRAINING</h3>
                        <button onClick={toggleSquatsForm}>SQUATS</button>
                        <button onClick={toggleLatPulldownsForm}>LAT PULLDOWNS</button>
                        <button onClick={toggleBicepCurlsForm}>BICEP CURLS</button>
                        <button onClick={toggleSitUpsForm}>SIT UPS</button>
                    </div>

                    {showSquatsForm && (
                        <div className="squats-form">
                            <h4>Log Squats Data</h4>
                            <form>
                                <label>Reps:</label>
                                <input
                                    type="number"
                                    name="reps"
                                    value={squatsData.reps}
                                    onChange={handleSquatsChange}
                                    required
                                />
                                <label>Weight (lbs):</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={squatsData.weight}
                                    onChange={handleSquatsChange}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    {showLatPulldownsForm && (
                        <div className="lat-pulldowns-form">
                            <h4>Log Lat Pulldowns Data</h4>
                            <form>
                                <label>Reps:</label>
                                <input
                                    type="number"
                                    name="reps"
                                    value={latPulldownsData.reps}
                                    onChange={handleLatPulldownsChange}
                                    required
                                />
                                <label>Weight (lbs):</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={latPulldownsData.weight}
                                    onChange={handleLatPulldownsChange}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    {showBicepCurlsForm && (
                        <div className="bicep-curls-form">
                            <h4>Log Bicep Curls Data</h4>
                            <form>
                                <label>Reps:</label>
                                <input
                                    type="number"
                                    name="reps"
                                    value={bicepCurlsData.reps}
                                    onChange={handleBicepCurlsChange}
                                    required
                                />
                                <label>Weight (lbs):</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={bicepCurlsData.weight}
                                    onChange={handleBicepCurlsChange}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    {showSitUpsForm && (
                        <div className="sit-ups-form">
                            <h4>Log Sit-Ups Data</h4>
                            <form>
                                <label>Reps:</label>
                                <input
                                    type="number"
                                    value={sitUpsData.reps}
                                    onChange={handleSitUpsChange}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    <div className="log-yoga">
                        <h3>YOGA</h3>
                        <button onClick={toggleYoga1Form}>YOGA1</button>
                        <button onClick={toggleYoga2Form}>YOGA2</button>
                    </div>

                    {showYoga1Form && (
                        <div className="yoga1-form">
                            <h4>Log Yoga1 Data</h4>
                            <form>
                                <label>Duration (in minutes):</label>
                                <input
                                    type="number"
                                    name="time"
                                    value={yoga1Data.time}
                                    onChange={handleYoga1Change}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}

                    {showYoga2Form && (
                        <div className="yoga2-form">
                            <h4>Log Yoga2 Data</h4>
                            <form>
                                <label>Duration (in minutes):</label>
                                <input
                                    type="number"
                                    name="time"
                                    value={yoga2Data.time}
                                    onChange={handleYoga2Change}
                                    required
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}
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
