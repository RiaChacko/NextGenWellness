import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";
import { jsPDF } from "jspdf";
import { doc, getDoc, collection, getDocs, setDoc, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import "../pages/RecommendedActivities.css";
import { db } from "./firebaseConfig";

const auth = getAuth();

// chatgpt api
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "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",
  dangerouslyAllowBrowser: true,
});

function RecommendedActivities() {
  // initialize variables
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekStartDateForDocId, setWeekStartDateForDocId] = useState(""); 
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [userId, setUserId] = useState(null);
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [hasPlan, setHasPlan] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    const month = weekStart.getMonth() + 1;
    const day = weekStart.getDate();
    const year = weekStart.getFullYear();

    const formattedDate = `${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day}/${year}`;

    const formattedDateForDocId = `${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}-${year}`;

    setWeekStartDate(formattedDate);
    setWeekStartDateForDocId(formattedDateForDocId);
// getting all workouts for the user
    const fetchWorkouts = async () => {
      try {
        const workoutsCollection = collection(db, "workouts");
        const workoutSnapshot = await getDocs(workoutsCollection);
        const workoutsList = workoutSnapshot.docs.map(doc => ({
          name: doc.data().name,
          trackingAttributes: doc.data().trackingAttributes.map(attr => ({
            key: attr.key,
            label: attr.label,
            placeholder: attr.placeholder,
            type: attr.type,
          })),
        }));
        setAvailableWorkouts(workoutsList);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
// show existing plan
    const fetchExistingPlan = async () => {
      if (!userId) return;
      try {
        const plansCollection = collection(db, "workoutPlans");
        const q = query(
          plansCollection,
          where("userId", "==", userId),
          where("weekStartDate", "==", formattedDate),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const planDoc = querySnapshot.docs[0];
          const planData = planDoc.data();
          const plan = typeof planData.plan === "string" ? JSON.parse(planData.plan) : planData.plan;
          setWorkoutPlan(plan);
          setHasPlan(true);
        } else {
          setWorkoutPlan(createEmptyPlan());
          setHasPlan(false);
        }
      } catch (error) {
        console.error("Error fetching existing plan:", error);
        setWorkoutPlan(createEmptyPlan());
        setHasPlan(false);
      }
    };

    fetchWorkouts();
    fetchExistingPlan();

    return () => unsubscribe();
  }, [userId]);

  const createEmptyPlan = () => {
    const emptyPlan = {};
    daysOfWeek.forEach(day => {
      emptyPlan[day] = [];
    });
    return emptyPlan;
  };

  const fetchUserData = async () => {
    if (!userId) return { goalsData: {}, historyData: [] };
    try {
      const goalsDoc = await getDoc(doc(db, "userGoals", userId));
      const goalsData = goalsDoc.exists() ? goalsDoc.data().goals : {};
      const historyDoc = await getDoc(doc(db, "userHistory", userId));
      const historyData = historyDoc.exists() ? historyDoc.data().history : [];
      return { goalsData, historyData };
    } catch (error) {
      console.error("Error fetching Firebase data:", error);
      return { goalsData: {}, historyData: [] };
    }
  };
// function that generates workout plan
  const generateWorkoutPlan = async () => {
    const { goalsData, historyData } = await fetchUserData();

    const workoutReference = availableWorkouts.map(workout => ({
      name: workout.name,
      trackingAttributes: workout.trackingAttributes.map(attr => attr.key),
    }));

    const prompt = `
      Based on the following user goals and workout history, create a personalized weekly workout plan for the week starting ${weekStartDate}. Include specific exercises, reps, sets, weights, or durations for each day (Monday to Sunday). Adjust the plan based on progress and goals. Use ONLY the workouts listed below, and include ONLY their specified tracking attributes. The number of workouts per day can vary as needed (0, 1, 2, 3, or more). Return the plan in JSON format with the following structure:

      {
        "Monday": [
          { "exerciseName": "Exact Workout Name", "attributes": { "key": "value", ... } },
          ...
        ],
        "Tuesday": [
          { "exerciseName": "Exact Workout Name", "attributes": { "key": "value", ... } },
          ...
        ],
        ...
        "Sunday": [
          { "exerciseName": "Rest", "attributes": { "description": "Rest activity description" } }
        ]
      }

      For rest days, use "Rest" as the exerciseName with a description in attributes. Do not include additional nesting like "Morning" or "Afternoon". Return only the JSON object without extra keys like "weekStarting" or "workoutPlan".

      Available Workouts:
      ${JSON.stringify(workoutReference, null, 2)}

      User Goals: ${JSON.stringify(goalsData, null, 2)}
      User History: ${JSON.stringify(historyData, null, 2)}
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a fitness expert creating personalized workout plans." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const rawResult = response.choices[0].message.content.trim();
      const cleanedResult = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
      console.log("Cleaned Response:", cleanedResult);
      const workoutPlan = JSON.parse(cleanedResult);

      if (userId) {
        const planDocRef = doc(db, "workoutPlans", `${userId}_${weekStartDateForDocId}`); 
        const planData = {
          userId,
          weekStartDate,
          createdAt: new Date().toISOString(),
          plan: JSON.stringify(workoutPlan),
        };
        console.log("Saving plan:", planData);
        await setDoc(planDocRef, planData, { merge: true });
      }

      setWorkoutPlan(workoutPlan);
      setHasPlan(true);
    } catch (error) {
      console.error("Error generating workout plan:", error);
      alert("Failed to generate workout plan: " + error.message);
    }
  };
// download pdf of workout plan function
  const downloadPDF = () => {
    if (!workoutPlan || !hasPlan) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica");
    doc.setTextColor(36, 35, 48);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Personalized Workout Plan", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Week of ${weekStartDate}`, 105, 30, { align: "center" });

    doc.setDrawColor(255, 93, 163);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    let yOffset = 45;
    Object.entries(workoutPlan).forEach(([day, activities]) => {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(93, 93, 252);
      doc.text(day, 20, yOffset);
      yOffset += 8;

      doc.setFontSize(12);
      doc.setTextColor(36, 35, 48);
      activities.forEach((activity) => {
        doc.setFont("helvetica", "bold");
        doc.text(`• ${activity.exerciseName}`, 25, yOffset);
        yOffset += 6;

        doc.setFont("helvetica", "normal");
        const attributesText = Object.entries(activity.attributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        const splitText = doc.splitTextToSize(attributesText, 160);
        doc.text(splitText, 30, yOffset);
        yOffset += splitText.length * 5 + 4;
      });

      yOffset += 5;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" });

    doc.save("workout_plan.pdf");
  };
// html structure for the fitness plan page
  return (
    <div className="recommended-container">
      <Navbar />
      <h2>PERSONALIZED WORKOUT PLAN</h2>
      <h3 className="week-info">Week of {weekStartDate}</h3>

      {!hasPlan && (
        <button className="show-workout-btn" onClick={generateWorkoutPlan}>
          Generate Workout Plan
        </button>
      )}
      {hasPlan && (
        <button className="regenerate-btn" onClick={generateWorkoutPlan}>
          Regenerate Workout Plan
        </button>
      )}

      {workoutPlan && (
        <div className="weekly-plan-containers">
          {Object.entries(workoutPlan).map(([day, activities]) => (
            <div key={day} className="workout-day-container">
              <h3>{day}</h3>
              <div className="activities-day">
                {activities.length === 0 ? (
                  <p className="no-activities">No workouts planned</p>
                ) : (
                  activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="exercise-name">{activity.exerciseName}</span>
                      <span className="attributes">
                        {Object.entries(activity.attributes).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
          <button
            className="download-pdf-btn"
            onClick={downloadPDF}
            disabled={!hasPlan}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default RecommendedActivities;
