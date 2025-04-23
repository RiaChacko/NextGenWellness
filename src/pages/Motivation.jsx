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
  import MotivationGallery from "./MotivationGallery";



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
            alert('User not authenticated'); // alert if the user is not logged into the app
            return;
        }

        try {
            await addDoc(collection(db, 'userWhys'), {
                uid: user.uid, // fetch user id from db
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


    // function to save the motivational quote to the database
    const handleMotivationSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('User not authenticated');
            return;
        }

        try {
            await addDoc(collection(db, 'userMotivation'), {
                uid: user.uid, // fetch user id from db
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

    // function to calculate the user's consecutive days of logged activities
    async function calculateStreak(userId) {
        const activitiesRef = collection(db, "users", userId, "activities");
        const q = query(activitiesRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs;
      
        if (docs.length === 0) return 0;
      
        // check if the latest activity is older than 24 hours and return 0 if so
        const now = new Date();
        const latest = docs[0].data().timestamp.toDate();
        if ((now - latest) / (1000 * 60 * 60) > 24) return 0;
      
        let streak = 1;

        // loop through the documents to check for consecutive days
        for (let i = 0; i < docs.length - 1; i++) {
          const current = docs[i].data().timestamp.toDate();
          const next = docs[i + 1].data().timestamp.toDate();
          const diffInHours = (current - next) / (1000 * 60 * 60);
      
          if (diffInHours <= 24) {
            streak++;
          } else {
            break;
          }
        }
      
        return streak;
      }

      const [streak, setStreak] = useState(0);
      
      
      useEffect(() => {
        async function fetchStreak() {
          const auth = getAuth();
          const user = auth.currentUser;
      
          if (!user) {
            console.warn("User not authenticated");
            return;
          }
      
          const currentStreak = await calculateStreak(user.uid);
          setStreak(currentStreak);
        }
      
        fetchStreak();
      }, []);

    const handleLogMotivation = () => {
        setStreak(streak + 1);
        localStorage.setItem("streak", streak + 1); 
    };

    // provide in-built motivational quotes tha the user can display on their page
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
                {/* <p>
                    <button onClick={handleLogMotivation}>Log Motivation or Workout</button>
                </p> */}
            </div>

            {/* call MotivationGallery component to display the user's motivation and why */}
            <MotivationGallery />

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
