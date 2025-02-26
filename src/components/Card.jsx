import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

Card.Content = ({ children }) => {
    return <div className="mt-2">{children}</div>;
  };

export default Card;
