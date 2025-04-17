import React, { useState,useEffect } from "react";
import "../pages/Motivation.css";
import Navbar from "./Navbar";
import {
    collection,
    doc,
    onSnapshot,
    getDoc,
    setDoc,
    getDocs,
    addDoc
  } from "firebase/firestore";
  import { auth, db } from "./firebaseConfig";
  import { getAuth } from 'firebase/auth';


function Motivation () {

    const [showWhyForm, setShowWhyForm] = useState(false);
    const [showMotivationForm, setShowMotivationForm] = useState(false);
    const [whyInput, setWhyInput] = useState("");
    const [motivationalQuote, setMotivationalQuote] = useState("");

    const toggleWhyForm = () => {
        setShowWhyForm(!showWhyForm);
    };

    const toggleMotivationForm = () => {
        setShowMotivationForm(!showMotivationForm);
    };

    const handleWhySubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('User not authenticated');
            return;
        }

        try {
            await addDoc(collection(db, 'userWhys'), {
                uid: user.uid, // associate with the user
                reason: whyInput,
                timestamp: new Date(),
            });
    
            setWhyInput('');
            setShowWhyForm(false);
        } catch (error) {
            console.error('Error saving reason:', error);
            alert('Error saving your reason. Please try again.');
        }
    };


    const handleMotivationSubmit = async (e) => {
        // e.preventDefault();
        // setShowMotivationForm(false); 
        // setMotivationalQuote(""); 
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('User not authenticated');
            return;
        }

        try {
            await addDoc(collection(db, 'userMotivation'), {
                uid: user.uid, // associate with the user
                motivation: motivationalQuote,
                timestamp: new Date(),
            });
    
            setMotivationalQuote('');
            setShowMotivationForm(false);
        } catch (error) {
            console.error('Error saving motivation:', error);
            alert('Error saving your motivation. Please try again.');
        }
    };

    const [streak, setStreak] = useState(0);
    const [lastLoginDate, setLastLoginDate] = useState(null);

    
    useEffect(() => {
        const savedStreak = localStorage.getItem("streak");
        const savedLastLoginDate = localStorage.getItem("lastLoginDate");

        if (savedStreak) {
            setStreak(parseInt(savedStreak, 10));
        }

 
        if (savedLastLoginDate) {
            const lastDate = new Date(savedLastLoginDate);
            const today = new Date();


            if (Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) > 1) {
                setStreak(0); 
            }
        }

        const currentDate = new Date().toISOString().split('T')[0]; 
        setLastLoginDate(currentDate);
        localStorage.setItem("lastLoginDate", currentDate);
    }, []);

    const handleLogMotivation = () => {
        setStreak(streak + 1);
        localStorage.setItem("streak", streak + 1); 
    };
    const [randomQuote, setRandomQuote] = useState("");
    const quotes = [
        "“The only bad workout is the one that didn’t happen.”",
        "“Don’t stop when you’re tired. Stop when you’re done.”",
        "“Your body can stand almost anything. It’s your mind that you have to convince.”",
        "“Success is the sum of small efforts, repeated day in and day out.”",
        "“Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.”"
    ];

    const generateRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
    };
    return(
        <div className="motivation-pg-container">
            <Navbar/>
            <h2>MOTIVATION</h2>
            <div className="why-motivaton-containers">
                <div className="why-container">
                    <h3>ADD YOUR WHY</h3>
                    <p>Why are you working out? What’s the passion behind it?</p>
                    <button onClick={toggleWhyForm}>Add Your Why</button>
                    {showWhyForm && (
                        <form onSubmit={handleWhySubmit}>
                            <input
                                type="text"
                                placeholder="Enter your reason..."
                                value={whyInput}
                                onChange={(e) => setWhyInput(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
                <div className="motivation-container">
                    <h3>ADD MOTIVATIONAL QUOTES</h3>
                    <p>What quotes pique your motivation to workout?</p>
                    <button onClick={toggleMotivationForm}>Add Motivational Quote</button>
                    {showMotivationForm && (
                        <form onSubmit={handleMotivationSubmit}>
                            <input
                                type="text"
                                placeholder="Enter your motivational quote..."
                                value={motivationalQuote}
                                onChange={(e) => setMotivationalQuote(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
            </div>
             <div className="motivation-image-section">
                <h2>Daily Motivation Streak</h2>
                <p> You've been consistent for <strong>{streak} days</strong>! 🔥</p>
                {streak > 0 && streak % 5 === 0 && (
                    <p className="motivational-message">Great job! Keep up the momentum!</p>
                )}
                <p>
                    <button onClick={handleLogMotivation}>Log Motivation or Workout</button>
                </p>
                {/* <div className="upload-pics-motivation">
                    {renderImages(images)}
                    <div className="image-box">
                        <label className="upload-label">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                multiple
                                hidden
                            />
                            <span className="plus-sign">+</span>
                        </label>
                    </div>
                </div> */}
            </div>

            {/* <div className="progress-so-far-section">
                <h2>Your Progress So Far</h2>
                <p>Upload images and videos of your progress so far.</p>
                <div className="upload-pics-progress">
                    {renderImages(progressImages)}
                    <div className="image-box">
                        <label className="upload-label">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleProgressFileChange}
                                multiple
                                hidden
                            />
                            <span className="plus-sign">+</span>
                        </label>
                    </div>
                </div>
            </div>  */}
            {/* <button className="motivation-submit">SUBMIT</button> */}
            <div className="random-quote-container">
                <h2>Random Motivation:</h2>
                <div className="quote-box">
                    <p>{randomQuote || "Click below to get a motivational quote!"}</p>
                </div>
                <button onClick={generateRandomQuote}>Get a New Quote</button>
            </div>
        </div>
    );
}

export default Motivation;
