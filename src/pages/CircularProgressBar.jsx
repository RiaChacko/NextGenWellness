import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const StaticCircularProgress = ({ percent }) => {
  const percentage = Math.min(percent.toFixed(2), 100); 

  return (
    <div style={{ width: "200px", height: "200px", margin: "auto" }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={10} 
        styles={{
          path: {
            stroke: "#FF5DA3", 
          },
          text: {
            fill: "#FF5DA3", 
            fontSize: "16px",
            fontWeight: "bold",
          },
          trail: {
            stroke: "#5D80FF", 
          },
        }}
      />
    </div>
  );
};

export default StaticCircularProgress;
