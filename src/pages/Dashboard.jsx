import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../pages/Dashboard.css";
import CircularProgress from "./CircularProgressBar";
import bell from "../assets/bell.svg";
import StepsChart from "./StepsGraph";
import activityImg from "../assets/activity1.svg";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, query, collection, getDocs, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Dashboard () {

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [activity, setActivity] = useState([]);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isMailClicked, setIsMailClicked] = useState(false);
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false); 
    };



    const toggleMailColor = () => {
      setIsMailClicked(!isMailClicked);
    };
 
    const navigate = useNavigate();

    useEffect(() => {
        const getData = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    try {
                        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setUser(currentUser);
                            setName(userData.name || "No name found");
                            setHeight(calcHeight(userData.height) || "No height found");
                            setWeight(userData.weight || "No weight found");
                            setAge(calcAge(userData.birthdate) || "No age found");
                        } else {
                            console.error("The user's document does not exist in the database.");
                        }
                        
                        const userId = currentUser.uid;
                        const today = new Date();
                        const localDate = today.toLocaleDateString('en-CA');
                        const docId = `${userId}-${localDate}`;
                
                        try {
                            const userDocRef = doc(db, "activities", docId);
                            const userSnap = await getDoc(userDocRef);
                            const userData = userSnap.data().activities;
                            if (userData.empty) {
                                setActivity([]);
                                setCaloriesBurned(0);
                            } else {
                                const activityArray = Object.values(userData);
                                let activities = [];
                                let totalCalories = 0;
                                activityArray.forEach((active) => {

                                    if (active.caloriesBurned !== undefined && typeof active.caloriesBurned === 'number') {
                                        totalCalories += active.caloriesBurned;
                                    }
                                    activities.push(active);
                                });
                                setActivity(activities);
                                setCaloriesBurned(totalCalories.toFixed(2));
                            }

                        }
                        catch(error)
                        {
                            console.error("Error: ",error)
                        }
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
                            setGoals(goalsArray);
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

    const calcHeight = (heightInput) => {
        const feet = Math.floor(heightInput / 12);
        const inches = heightInput % 12;
        return `${feet}'${inches}\"`;
    };

    const calcAge = (bdayInput) => {
        const [month, day, year] = bdayInput.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("There was an error signing the user out:", error);
        }
    };
        
    return(
        <div className="dashboard-container">
            <Navbar/>
            <div className="top-header-dashboard">
                <h3>WELCOME BACK {name}!</h3>
                <div className="metrics-header">
                    <div className="metric-header">
                        <h4>Weight</h4>
                        <p>{weight} lb</p>
                    </div>
                    <div className="metric-header">
                        <h4>Height</h4>
                        <p>{height} in</p>
                    </div>
                    <div className="metric-header">
                        <h4>Age</h4>
                        <p>{age} years</p>
                    </div>
                    
                </div>
                <div className="icons-dashboard">
                <i
          className="fa-solid fa-envelope"
          style={{
            color: isMailClicked ? "#FF5DA3" : "white", 
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={toggleMailColor}
        ></i>
        <p style={{color: "white", fontSize: "1rem", display: "flex", flexDirection: "column"}}>
                      {isMailClicked ? "Email notifications ON" : "Email notifications OFF"}
                    </p>
                </div>
                <button onClick={handleLogout}>LOG OUT</button>
            </div>
            <div className="dashboard-content-space">
                <div className="dashboard-metrics-container">
                    <div className="metric-content">
                    <h3>METRICS</h3>
                    <div className="metric-content-inner">
                        {caloriesBurned==0 
                            ? <p>No activity tracked yet for today!</p> 
                            : <p>Calories Burned: {caloriesBurned/1}kcal</p>}
                    </div>
                        <button className="metrics-btn" onClick={openModal}>VIEW ALL METRICS</button>
                    </div>
                    <div className="progress-bar-dashboard">
                        <CircularProgress percent={(caloriesBurned/1)}/>
                    </div>
                    {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>All Metrics</h3>
              <p>Calories Burned: {caloriesBurned/1}kcal</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
                </div>
                <div className="steps-count-container">
                    <StepsChart/>
                </div>
                <div className="fitness-goals-dashboard">
                    <h3>Fitness Goals</h3>
                    {goals.length > 0 ? (
                        goals.slice(0, 3).map((goal, index) => {
                            const matchingActivities = activity.filter(act => act.activityType === goal.exerciseName);

                            let totalValue = 0;
                            let unit = "";
                            
                            if (matchingActivities.length > 0) {
                                matchingActivities.forEach(act => {
                                    const actAttributes = act.attributes;

                                    const value =
                                        actAttributes.Time || actAttributes.Duration || actAttributes.Reps ||
                                        actAttributes.Distance || actAttributes?.["Number of Rounds"];

                                    if (value) totalValue += Number(value);
                                });
                                
                            }
                            unit = goal.attributes?.Time || goal.attributes?.Duration ? "min" :
                                goal.attributes?.Reps ? "reps" :
                                goal.attributes?.Distance ? "miles" :
                                goal.attributes?.["Number of Rounds"] ? "rounds" : "";

                            const goalValue = goal.attributes?.Time || goal.attributes?.Duration ||
                                goal.attributes?.Reps || goal.attributes?.Distance || 
                                goal.attributes?.["Number of Rounds"];

                            let progress = 0;
                            if (goalValue && totalValue) {
                                progress = ((totalValue / goalValue) * 100).toFixed(2);
                            }

                            
                            return (
                                <div key={index} className="fitness-goals-individual">
                                    <div className="time-card">
                                        <span>{totalValue || 0}</span>
                                        <span>{unit}</span>
                                    </div>
                                    <div className="goal-name-log">
                                        <h4>{goal.exerciseName}</h4>
                                        <span>{goalValue || "N/A"}</span>
                                        <span>
                                            {goal.attributes?.Time 
                                                ? " min/day"
                                                : goal.attributes?.Duration
                                                ? " min/day"
                                                : goal.attributes?.Reps
                                                ? " reps/day"
                                                : goal.attributes?.Distance
                                                ? " miles/day"
                                                : goal.attributes?.["Number of Rounds"]
                                                ? " rounds"
                                                : ""}
                                        </span>
                                    </div>
                                    <div className="progress-bar-dashboard" style={{ width: '4rem', height: '4rem' }}>
                                        <CircularProgress percent={progress}/>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Add goals to view progress!</p>
                    )}

                    <Link to="/goals">
                        <button className="metrics-btn">{goals.length > 0 ? "VIEW ALL GOALS" : "ADD GOALS"}</button>
                    </Link>
                </div>
                <div className="recommended-activity-dashboard">
                    <h3>Recommended Activity</h3>
                    <div className="recommended-activity-individual">
                        <div className="icon-activity">
                            <img src={activityImg}></img>
                        </div>
                        <div className="workout-title-info">
                            <h4>Workout for Beginners</h4>
                            <span>Starts from July 18 2025</span>
                        </div>
                        <div className="workout-times">
                            <span>7:00 AM -</span>
                            <span>9:00 AM -</span>
                        </div>
                        
                    </div>
                    <div className="recommended-activity-individual">
                        <div className="icon-activity">
                            <img src={activityImg}></img>
                        </div>
                        <div className="workout-title-info">
                            <h4>Workout for Advanced</h4>
                            <span>Starts from July 25 2025</span>
                        </div>
                        <div className="workout-times">
                            <span>8:00 AM -</span>
                            <span>10:00 AM -</span>
                        </div>
                        
                    </div>
                    <div className="recommended-activity-individual">
                        <div className="icon-activity">
                            <img src={activityImg}></img>
                        </div>
                        <div className="workout-title-info">
                            <h4>Morning Yoga</h4>
                            <span>Starts from Aug 2 2025</span>
                        </div>
                        <div className="workout-times">
                            <span>8:00 AM -</span>
                            <span>9:00 AM -</span>
                        </div>
                        
                    </div>
                    <div className="recommended-activity-individual">
                        <div className="icon-activity">
                            <img src={activityImg}></img>
                        </div>
                        <div className="workout-title-info">
                            <h4>Cardio</h4>
                            <span>Starts from Sept 3 2025</span>
                        </div>
                        <div className="workout-times">
                            <span>7:00 AM -</span>
                            <span>9:00 AM -</span>
                        </div>
                        
                    </div>
                  <Link to="/activities"><button className="metrics-btn">VIEW ALL ACTIVITIES</button></Link> 
                </div>
              
            </div>
           
        </div>
    );
}

export default Dashboard;