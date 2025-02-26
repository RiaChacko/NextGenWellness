import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function StepsChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'], 
    datasets: [
      {
        label: 'Steps',
        data: [5020, 2500, 1800, 2300, 5200, 3500, 2900], 
        backgroundColor: '#FF5DA3', 
        borderRadius: 5, 
        borderWidth: 1,
      },
    ],
  };

  
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff', 
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        titleColor: '#fff', 
        bodyColor: '#fff', 
      },
    },
    backgroundColor: '#2b2939',
  };

  return (
    <div style={{ width: '90%', margin: 'auto'}}>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Steps Measurements</h2>
      <p style={{ color: 'white', textAlign: 'center' }}>You’re walking more than you usually do by this point</p>
      <Bar data={data} options={options} />
    </div>
  );

}

export default StepsChart;
