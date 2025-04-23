import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// using the react circular progress bar library
// this function accepts a parameter of percent
const StaticCircularProgress = ({ percent }) => {
  const percentage = Math.min(percent, 100); 
// styling of progress bar
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
