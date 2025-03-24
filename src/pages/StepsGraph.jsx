import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { auth, db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function StepsChart() {
  const [user, setUser] = useState(null);
  const [stepsData, setStepsData] = useState(Array(7).fill(0));
  const [noData, setNoData] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

    return () => unsubscribe();
  }, []);

  const getLast7Days = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    return [...Array(7)].map((_, i) => days[(today - 6 + i + 7) % 7]);
  };

  useEffect(() => {
    if (!user) return;

    const fetchStepsData = async () => {
      if (!user) return;
  
      const userId = user.uid;
      const q = query(collection(db, "activities"), where("userId", "==", userId));
  
      try {
          const querySnapshot = await getDocs(q);
          const stepsMap = {};
  
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              data.activities.forEach((activity) => {
                  if (activity.activityType === "Steps") {
                      const activityDate = activity.timestamp.toDate(); 
                      const localDate = new Date(activityDate.getTime() - activityDate.getTimezoneOffset() * 60000); 
                      const dateKey = localDate.toISOString().split("T")[0];
  
                      stepsMap[dateKey] = (stepsMap[dateKey] || 0) + activity.steps;
                  }
              });
          });
  
          const weekDays = [...Array(7)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
              return localDate.toISOString().split("T")[0];
          });
  
          const newStepsData = weekDays.map((date) => stepsMap[date] || 0);
          setStepsData(newStepsData);
          setNoData(newStepsData.every((step) => step === 0));
      } catch (error) {
          console.error("Error fetching steps data:", error);
      }
  };

    fetchStepsData();
  }, [user]);

  const data = {
    labels: getLast7Days(),
    datasets: [
        {
            label: 'Steps',
            data: stepsData,
            backgroundColor: '#FF5DA3',
            borderRadius: 5,
            borderWidth: 1,
        },
    ],
};

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { color: '#fff' } },
      x: { ticks: { color: '#fff' } },
    },
    plugins: {
      legend: { labels: { color: '#fff' } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    backgroundColor: '#2b2939',
  };

  return (
    <div style={{ width: '90%', margin: 'auto', textAlign: 'center' }}>
      <h2 style={{ color: 'white' }}>Steps Measurements</h2>
      {!user ? (
        <p style={{ color: 'white', fontSize: '18px', marginTop: '20px' }}>Log in to track your steps!</p>
      ) : noData ? (
        <p style={{ color: 'white', fontSize: '18px', marginTop: '20px' }}>Log steps to view progress!</p>
      ) : (
        <>
          <p style={{ color: 'white' }}>Your steps for the past week</p>
          <Bar data={data} options={options} />
        </>
      )}
    </div>
  );
}

export default StepsChart;
