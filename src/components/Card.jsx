import React from "react";

const Card = ({ children, category }) => {
  const categoryColors = {
    cardio: "bg-pink-600",
    strength: "bg-blue-600",
    yoga: "bg-purple-600",
  };

  return (
    // <div className={`p-4 rounded-lg shadow-md ${categoryColors[category] || "bg-red-800"}`}>
    //   {children}
    // </div>
    <div
    className="p-4 rounded-lg shadow-md"
    style={{ backgroundColor: categoryColors[category] || "#374274" }}
  >
    {children}
  </div>
  );
};

Card.Content = ({ children }) => {
  return <div className="mt-2 text-white">{children}</div>;
};

export default Card;
