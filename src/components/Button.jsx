import React from "react";
// button component that can be reused
const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
    onClick={onClick}
    className={`px-4 py-2 text-white font-semibold rounded-lg transition ${className}`}
    style={{ backgroundColor: "#FF5DA3" }}
  >
    {children}
  </button>
  );
};

export default Button;
