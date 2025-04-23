import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../pages/Dashboard.css";
import CircularProgress from "./CircularProgressBar";
import { FaBell, FaTimes } from "react-icons/fa";
import StepsChart from "./StepsGraph";
import activityImg from "../assets/activity1.svg";
import { auth, db } from "./firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  getDocs,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Dashboard() {
  // initialize needed variables 
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState([]);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [notifications, setNotifications] = useState([]);
  // used to route to different pages
  const navigate = useNavigate();
  // used for metrics overlay 
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // toggle function for the notifications modal
  const toggleNotificationModal = () => {
    if (!isNotificationModalOpen) computeNotifications(); 
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };
// useEffect used onload of the page
  useEffect(() => {
    const getData = onAuthStateChanged(auth, async (currentUser) => {
      //if a user is currently logged in then proceed
      if (currentUser) {
        try {
          // retrieving user details
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(currentUser);
            setName(userData.name || "No name found");
            setHeight(calcHeight(userData.height) || "No height found");
            setWeight(userData.weight || "No weight found");
            setAge(calcAge(userData.birthdate) || "No age found");
          }
// getting user details and setting the retrieved information to the variables initialized above
          const userId = currentUser.uid;
          const today = new Date();
          const localDate = today.toLocaleDateString("en-CA");
          const docId = `${userId}-${localDate}`;
          const userDocRef = doc(db, "activities", docId);
          const userSnap = await getDoc(userDocRef);

          //gets user data for the current day if any activity has been logged
          if (userSnap.exists()) {
            const userData = userSnap.data().activities;
            const activityArray = Object.values(userData);
            let activities = [];
            let totalCalories = 0;
            activityArray.forEach((active) => {
              if (
                active.caloriesBurned !== undefined &&
                typeof active.caloriesBurned === "number"
              ) {
                totalCalories += active.caloriesBurned;
              }
              activities.push(active);
            });
            setActivity(activities);
            setCaloriesBurned(totalCalories.toFixed(2));
          }
          //gets user goals if any have been created
          const goalDoc = await getDoc(doc(db, "userGoals", currentUser.uid));
          if (goalDoc.exists()) {
            const goalData = goalDoc.data()["goals"];
            const goalsObject = Object.keys(goalData)
              .filter((key) => key.startsWith("goals."))
              .reduce((obj, key) => {
                obj[key] = goalData[key];
                return obj;
              }, {});
            const goalsArray = Object.values(goalsObject);
            setGoals(goalsArray);
          }

          const weekStart = new Date(
            today.setDate(
              today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
            )
          );
          const month = weekStart.getMonth() + 1;
          const day = weekStart.getDate();
          const year = weekStart.getFullYear();
          const formattedDate = `${month < 10 ? "0" + month : month}/${
            day < 10 ? "0" + day : day
          }/${year}`;

          //gets ai-made fitness plan if it has been generated for the current week
          const plansCollection = collection(db, "workoutPlans");
          const q = query(
            plansCollection,
            where("userId", "==", currentUser.uid),
            where("weekStartDate", "==", formattedDate),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const planDoc = querySnapshot.docs[0];
            const planData = planDoc.data();
            const plan =
              typeof planData.plan === "string"
                ? JSON.parse(planData.plan)
                : planData.plan;
            setWorkoutPlan(plan);
          }

          computeNotifications(currentUser.uid);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    });

    return () => getData();
  }, []);

  //This function adds notifications for the user as they progress using the app

  const computeNotifications = async (userId = user?.uid) => {
    if (!userId) return;

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const notificationsList = [];

    const achievedGoals = [];
    for (const goal of goals) {
      const activitiesToday = activity.filter(
        (act) =>
          act.activityType === goal.exerciseName &&
          new Date(act.timestamp.toDate()) >= todayStart
      );
      for (const act of activitiesToday) {
        const goalAttrs = goal.attributes;
        const actAttrs = act.attributes || {};
        let achieved = true;
        if (goal.category === "strength") {
          achieved =
            (Number(actAttrs.Reps) >= Number(goalAttrs.Reps) || !goalAttrs.Reps) &&
            (Number(actAttrs.Sets) >= Number(goalAttrs.Sets) || !goalAttrs.Sets) &&
            (Number(actAttrs.Weight) >= Number(goalAttrs.Weight) ||
              !goalAttrs.Weight);
        } else if (goal.category === "cardio") {
          achieved =
            (Number(actAttrs.Distance) >= Number(goalAttrs.Distance) ||
              !goalAttrs.Distance) &&
            (Number(actAttrs.Time) >= Number(goalAttrs.Time) || !goalAttrs.Time);
        }
        if (achieved) {
          achievedGoals.push(goal.exerciseName);
        }
      }
    }
    if (achievedGoals.length > 0) {
      notificationsList.push({
        id: `goal-achieve-${today.getTime()}`,
        title: "Goal Achievements",
        message: `You hit your goals for: ${achievedGoals.join(", ")}!`,
        date: today,
      });
    }
// goals info
    for (const goal of goals) {
      const q = query(
        collection(db, "activities"),
        where("userId", "==", userId),
        where("activityType", "==", goal.exerciseName),
        orderBy("timestamp", "desc")
      );
      const activityDocs = await getDocs(q);
      let count = 0;
      activityDocs.forEach((doc) => {
        const act = doc.data();
        const actAttrs = act.attributes || {};
        const goalAttrs = goal.attributes;
        let achieved = true;
        if (goal.category === "strength") {
          achieved =
            (Number(actAttrs.Reps) >= Number(goalAttrs.Reps) || !goalAttrs.Reps) &&
            (Number(actAttrs.Sets) >= Number(goalAttrs.Sets) || !goalAttrs.Sets) &&
            (Number(actAttrs.Weight) >= Number(goalAttrs.Weight) ||
              !goalAttrs.Weight);
        } else if (goal.category === "cardio") {
          achieved =
            (Number(actAttrs.Distance) >= Number(goalAttrs.Distance) ||
              !goalAttrs.Distance) &&
            (Number(actAttrs.Time) >= Number(goalAttrs.Time) || !goalAttrs.Time);
        }
        if (achieved) count++;
      });
      if ([5, 10, 20].includes(count)) {
        notificationsList.push({
          id: `goal-streak-${goal.exerciseName}-${count}`,
          title: "Goal Streak",
          message: `You're on fire! You've hit your ${goal.exerciseName} goal ${count} times!`,
          date: today,
        });
      }
    }

    const workoutQuery = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      where("activityType", "!=", "Steps")
    );
    const workoutDocs = await getDocs(workoutQuery);
    const totalWorkouts = workoutDocs.size;
    const workoutMilestones = [25, 50, 100, 250];
    const reachedMilestone = workoutMilestones.find(
      (m) => totalWorkouts >= m && totalWorkouts < m + 10
    );
    if (reachedMilestone) {
      notificationsList.push({
        id: `workouts-${reachedMilestone}`,
        title: "Workout Milestone",
        message: `Milestone alert! You've logged ${reachedMilestone} workouts in total!`,
        date: today,
      });
    }

    const historyQuery = query(
      collection(db, "userHistory"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const historyDocs = await getDocs(historyQuery);
    let streak = 0;
    let lastDate = null;
    const datesSeen = new Set();
    for (const doc of historyDocs.docs) {
      const hist = doc.data();
      const date = new Date(hist.date);
      const dateStr = date.toLocaleDateString("en-CA");
      if (datesSeen.has(dateStr)) continue;
      datesSeen.add(dateStr);
      const dayDiff = lastDate
        ? Math.floor((lastDate - date) / (1000 * 60 * 60 * 24))
        : 0;
      if (lastDate === null || dayDiff === 1) {
        streak++;
        lastDate = date;
      } else if (dayDiff > 1) {
        break;
      }
    }
    const streakMilestones = [3, 5, 10, 20, 50, 100];
    if (streakMilestones.includes(streak)) {
      notificationsList.push({
        id: `activity-streak-${streak}`,
        title: "Activity Streak",
        message: `Keep it up! You've logged activities for ${streak} days in a row!`,
        date: today,
      });
    }
// streak setting section
    let stepStreak = 0;
    lastDate = null;
    const stepDatesSeen = new Set();
    const stepsQuery = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      where("activityType", "==", "Steps"),
      orderBy("timestamp", "desc")
    );
    const stepDocs = await getDocs(stepsQuery);
    for (const doc of stepDocs.docs) {
      const act = doc.data();
      if (act.steps < 5000) continue;
      const date = new Date(act.timestamp.toDate());
      const dateStr = date.toLocaleDateString("en-CA");
      if (stepDatesSeen.has(dateStr)) continue;
      stepDatesSeen.add(dateStr);
      const dayDiff = lastDate
        ? Math.floor((lastDate - date) / (1000 * 60 * 60 * 24))
        : 0;
      if (lastDate === null || dayDiff === 1) {
        stepStreak++;
        lastDate = date;
      } else if (dayDiff > 1) {
        break;
      }
    }
    const stepMilestones = [3, 5, 10, 20];
    if (stepMilestones.includes(stepStreak)) {
      notificationsList.push({
        id: `steps-streak-${stepStreak}`,
        title: "Steps Streak",
        message: `Step it up! You've hit 5,000 steps for ${stepStreak} days straight!`,
        date: today,
      });
    }
// setting the fitness plan view
    if (workoutPlan) {
      const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const currentDay = daysOfWeek[currentDayIndex];
      const planActivities = workoutPlan[currentDay] || [];
      const loggedActivities = activity
        .filter((act) => new Date(act.timestamp.toDate()) >= todayStart)
        .map((act) => act.activityType);
      const completed = planActivities.some(
        (planAct) =>
          planAct.exerciseName !== "Rest" &&
          loggedActivities.includes(planAct.exerciseName)
      );
      if (completed) {
        notificationsList.push({
          id: `plan-${currentDay}-${today.getTime()}`,
          title: "Plan Completion",
          message: `Great job! You completed your ${currentDay} plan!`,
          date: today,
        });
      }

      const hasNonRest = planActivities.some(
        (act) => act.exerciseName !== "Rest"
      );
      if (hasNonRest && !completed) {
        const missingWorkouts = planActivities
          .filter(
            (act) =>
              act.exerciseName !== "Rest" &&
              !loggedActivities.includes(act.exerciseName)
          )
          .map((act) => act.exerciseName);
        if (missingWorkouts.length > 0) {
          notificationsList.push({
            id: `missed-plan-${currentDay}-${today.getTime()}`,
            title: "Plan Reminder",
            message: `Don't miss out! You still need to log: ${missingWorkouts.join(
              ", "
            )} for today!`,
            date: today,
          });
        }
      }
    }
// retrieving user history
    const historyWeightQuery = query(
      collection(db, "userHistory"),
      where("userId", "==", userId),
      where("type", "==", "Weight"),
      orderBy("date", "desc"),
      limit(2)
    );
    const weightDocs = await getDocs(historyWeightQuery);
    if (weightDocs.size >= 2) {
      const [latest, previous] = weightDocs.docs.map((doc) => doc.data());
      const latestWeight = parseFloat(
        latest.details.match(/Logged new weight of (\d+\.?\d*)lb/)?.[1]
      );
      const prevWeight = parseFloat(
        previous.details.match(/Logged new weight of (\d+\.?\d*)lb/)?.[1]
      );
      if (latestWeight && prevWeight) {
        const diff = Math.abs(latestWeight - prevWeight);
        const milestones = [2, 5, 10];
        if (milestones.includes(Math.floor(diff))) {
          const direction = latestWeight < prevWeight ? "lost" : "gained";
          notificationsList.push({
            id: `weight-${Math.floor(diff)}-${today.getTime()}`,
            title: "Weight Milestone",
            message: `Progress alert! You've ${direction} ${Math.floor(
              diff
            )} lbs since your last weight log!`,
            date: today,
          });
        }
      }
    }

    setNotifications(notificationsList);
  };

  //Calculates user height in ft/inches to display on top bar
  const calcHeight = (heightInput) => {
    const feet = Math.floor(heightInput / 12);
    const inches = heightInput % 12;
    return `${feet}'${inches}\"`;
  };

  //Calculates user age in years to display on top bar
  const calcAge = (bdayInput) => {
    const [month, day, year] = bdayInput.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  //Logs user out if they click the logout button on top bar
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //shows recommended activities on dashboard if user has clicked
  // generate on fitness plan page
  const getRecommendedActivities = () => {
    if (!workoutPlan) return [];
    const activities = [];
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const weekStart = new Date(
      today.setDate(
        today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
      )
    );
    const relevantDays = daysOfWeek.slice(currentDayIndex);
    let daysWithActivities = 0;
    relevantDays.forEach((day, offset) => {
      if (daysWithActivities >= 3) return;
      const dayActivities = workoutPlan[day] || [];
      const activityDate = new Date(weekStart);
      activityDate.setDate(weekStart.getDate() + currentDayIndex + offset);
      const formattedDate = activityDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const hasNonRestActivities = dayActivities.some(
        (activity) => activity.exerciseName !== "Rest"
      );
      if (hasNonRestActivities) {
        dayActivities.forEach((activity) => {
          if (activity.exerciseName !== "Rest") {
            const duration =
              activity.attributes?.Duration || activity.attributes?.Time || "";
            activities.push({
              exerciseName: activity.exerciseName,
              day: day,
              date: formattedDate,
              duration: duration ? `${duration} min` : "",
            });
          }
        });
        daysWithActivities++;
      }
    });
    return activities;
  };
// notifications overlay
  const NotificationModal = ({ onClose }) => {
    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      // html for the notifications overlay
      <div className="notification-modal">
        <button className="notification-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h1>Notifications</h1>
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <h3>{notification.title}</h3>
              <p className="notification-date">{formatDate(notification.date)}</p>
              <p>{notification.message}</p>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    // html/css styling for the entire dashboard page
    <div className="dashboard-container">
      <Navbar />
      <div className="top-header-dashboard">
        <h3>WELCOME BACK {name}!</h3>
        <div className="metrics-header">
          <div className="metric-header">
            <h4>Weight</h4>
            <p>{weight} lb</p>
          </div>
          <div className="metric-header">
            <h4>Height</h4>
            <p>{height}</p>
          </div>
          <div className="metric-header">
            <h4>Age</h4>
            <p>{age} years</p>
          </div>
          <div className="icons-dashboard">
            <button
              className="notification-button"
              onClick={toggleNotificationModal}
            >
              <FaBell size={20} />
            </button>
            <button onClick={handleLogout}>LOG OUT</button>
        </div>
        </div>
        
      </div>
      <div className="dashboard-content-space">
        <div className="dashboard-metrics-container">
          <div className="metric-content">
            <h3>METRICS</h3>
            <div className="metric-content-inner">
              {caloriesBurned == 0 ? (
                <p>No activity tracked yet for today!</p>
              ) : (
                <p>Calories Burned: {caloriesBurned / 1}kcal</p>
              )}
            </div>
            <button className="metrics-btn" onClick={openModal}>
              VIEW ALL METRICS
            </button>
          </div>
          <div className="progress-bar-dashboard">
            <CircularProgress percent={caloriesBurned / 1} />
          </div>
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>All Metrics</h3>
                <p>Calories Burned: {caloriesBurned / 1}kcal</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </div>
        <div className="steps-count-container">
          <StepsChart />
        </div>
        <div className="fitness-goals-dashboard">
          <h3>Fitness Goals</h3>
          {goals.length > 0 ? (
            goals.slice(0, 3).map((goal, index) => {
              const matchingActivities = activity.filter(
                (act) => act.activityType === goal.exerciseName
              );
              let totalValue = 0;
              let unit = "";
              if (matchingActivities.length > 0) {
                matchingActivities.forEach((act) => {
                  const actAttributes = act.attributes;
                  const value =
                    actAttributes.Time ||
                    actAttributes.Duration ||
                    actAttributes.Reps ||
                    actAttributes.Distance ||
                    actAttributes?.["Number of Rounds"];
                  if (value) totalValue += Number(value);
                });
              }
              unit =
                goal.attributes?.Time || goal.attributes?.Duration
                  ? "min"
                  : goal.attributes?.Reps
                  ? "reps"
                  : goal.attributes?.Distance
                  ? "miles"
                  : goal.attributes?.["Number of Rounds"]
                  ? "rounds"
                  : "";
              const goalValue =
                goal.attributes?.Time ||
                goal.attributes?.Duration ||
                goal.attributes?.Reps ||
                goal.attributes?.Distance ||
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
                  <div
                    className="progress-bar-dashboard"
                    style={{ width: "4rem", height: "4rem" }}
                  >
                    <CircularProgress percent={progress} />
                  </div>
                </div>
              );
            })
          ) : (
            <p>Add goals to view progress!</p>
          )}
          <Link to="/goals">
            <button className="metrics-btn">
              {goals.length > 0 ? "VIEW ALL GOALS" : "ADD GOALS"}
            </button>
          </Link>
        </div>
        <div className="recommended-activity-dashboard">
          <h3>Recommended Activity</h3>
          {getRecommendedActivities().length > 0 ? (
            getRecommendedActivities().map((activity, index) => (
              <div key={index} className="recommended-activity-individual">
                <div className="icon-activity">
                  <img src={activityImg} alt="Activity Icon" />
                </div>
                <div className="workout-title-info">
                  <h4>{activity.exerciseName}</h4>
                  <span>
                    {activity.day} - {activity.date}
                  </span>
                </div>
                <div className="workout-times">
                  {activity.duration && <span>{activity.duration}</span>}
                </div>
              </div>
            ))
          ) : (
            <p>
              No recommended activities available. Generate a
              workout plan!
            </p>
          )}
          <Link to="/activities">
            <button className="metrics-btn">VIEW ALL ACTIVITIES</button>
          </Link>
        </div>
      </div>
      {isNotificationModalOpen && <NotificationModal onClose={toggleNotificationModal} />}
    </div>
  );
}

export default Dashboard;