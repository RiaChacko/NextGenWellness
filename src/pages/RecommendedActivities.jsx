import React, { useState, useEffect } from "react";
import * as OpenAI from "openai";
import Navbar from "./Navbar";
import "../pages/RecommendedActivities.css";

function RecommendedActivities() {
  // const configuration = new OpenAI.Configuration({
  //   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  // });
  // const openai = new OpenAI.OpenAIApi(configuration);

  // const handleOpenAIPrompt = async () => {
  //   const userPrompt = prompt("Enter your question for ChatGPT:");
  //   if (!userPrompt) return;

  //   try {
  //     const response = await openai.createCompletion({
  //       model: "text-davinci-003",
  //       prompt: userPrompt,
  //       max_tokens: 100,
  //       temperature: 0.7,
  //     });
  //     alert(response.data.choices[0].text.trim());
  //   } catch (error) {
  //     console.error("Error interacting with OpenAI:", error);
  //     alert("An error occurred while interacting with ChatGPT.");
  //   }
  // };
  const [currentDate, setCurrentDate] = useState("");
  const [showWorkout, setShowWorkout] = useState(false); 

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const formattedDate = `${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day}`;
    setCurrentDate(formattedDate);
  }, []);


  const handleShowWorkoutClick = () => {
    setShowWorkout(!showWorkout); 
  };

  return (
    <div className="recommended-container">
      <Navbar />
      <h2>PERSONALIZED WORKOUT PLAN</h2>
      <h3 className="week-info">Week of {currentDate}</h3>

      <button className="show-workout-btn" onClick={handleShowWorkoutClick}>
        {showWorkout ? "Hide Workout Plan" : "Ask ChatGPT"}
      </button>

      {showWorkout && (
        <div className="weekly-plan-containers">
          <div className="workout-day-container">
            <h3>Monday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
          <div className="workout-day-container">
            <h3>Tuesday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
          <div className="workout-day-container">
            <h3>Wednesday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
          <div className="workout-day-container">
            <h3>Thursday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
          <div className="workout-day-container">
            <h3>Friday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
          <div className="workout-day-container">
            <h3>Saturday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
          <div className="workout-day-container">
            <h3>Sunday</h3>
            <div className="activities-day">
              <p>Yoga</p>
              <p>Running</p>
              <p>Pilates</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendedActivities;
