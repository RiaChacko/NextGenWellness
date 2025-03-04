import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../pages/Dashboard.css";
import CircularProgress from "./CircularProgressBar";
import bell from "../assets/bell.svg";
import StepsChart from "./StepsGraph";
import activity from "../assets/activity1.svg";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Dashboard () {

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");

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
                    <i className="fa-solid fa-bell" style={{ color: "white", fontSize: "1.5rem" }}></i>
                    <i className="fa-solid fa-search" style={{ color: "white", fontSize: "1.5rem" }}></i>
                </div>
                <button onClick={handleLogout}>LOG OUT</button>
            </div>
            <div className="dashboard-content-space">
                <div className="dashboard-metrics-container">
                    <div className="metric-content">
                    <h3>METRICS</h3>
                        <div className="metric-content-inner">
                            <p>Calories Burned</p>
                            {/* <span>31.2%</span> */}
                        </div>
                        {/* <div className="metric-content-inner">
                            <p>Carbs</p>
                            <span>23.2%</span>
                        </div>
                        <div className="metric-content-inner">
                            <p>Proteins</p>
                            <span>11.9%</span>
                        </div> */}
                        <button className="metrics-btn">VIEW ALL METRICS</button>
                    </div>
                    <div className="progress-bar-dashboard">
                        <CircularProgress/>
                    </div>
                </div>
                <div className="steps-count-container">
                    <StepsChart/>
                </div>
                <div className="fitness-goals-dashboard">
                    <h3>Fitness Goals</h3>
                    <div className="fitness-goals-individual">
                        <div className="time-card">
                            <span>10</span>
                            <span>min</span>
                        </div>
                        <div className="goal-name-log">
                            <h4>ABS& STRETCH</h4>
                            <span>10 min/day</span>
                        </div>
                        <div className="progress-bar-dashboard" style={{ width: '4rem', height: '4rem' }}>
                            <CircularProgress/>
                        </div>

                    </div>
                    <div className="fitness-goals-individual">
                        <div className="time-card">
                            <span>10</span>
                            <span>min</span>
                        </div>
                        <div className="goal-name-log">
                            <h4>ABS& STRETCH</h4>
                            <span>10 min/day</span>
                        </div>
                        <div className="progress-bar-dashboard" style={{ width: '4rem', height: '4rem' }}>
                            <CircularProgress/>
                        </div>

                    </div>
                    <div className="fitness-goals-individual">
                        <div className="time-card">
                            <span>10</span>
                            <span>min</span>
                        </div>
                        <div className="goal-name-log">
                            <h4>ABS& STRETCH</h4>
                            <span>10 min/day</span>
                        </div>
                        <div className="progress-bar-dashboard" style={{ width: '4rem', height: '4rem' }}>
                            <CircularProgress/>
                        </div>
                    </div>
                    <button className="metrics-btn">VIEW ALL GOALS</button>

                </div>
                <div className="recommended-activity-dashboard">
                    <h3>Recommended Activity</h3>
                    <div className="recommended-activity-individual">
                        <div className="icon-activity">
                            <img src={activity}></img>
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
                            <img src={activity}></img>
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
                            <img src={activity}></img>
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
                            <img src={activity}></img>
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
                   <button className="metrics-btn">VIEW ALL ACTIVITIES</button>
                </div>
              
            </div>
           
        </div>
    );
}

export default Dashboard;