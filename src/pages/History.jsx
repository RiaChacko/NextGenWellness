import React, { useState } from "react";
import Navbar from "./Navbar";
import "./History.css";

function History() {
  const historyData = [
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
    { item: "Recorded Weight", type: "Weight", user: "user4", date: "Today, 5:41 AM" },
    { item: "Recorded Yoga Workout", type: "Workout", user: "user4", date: "Today, 5:41 AM" },
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
    { item: "Steps Count", type: "Step", user: "user4", date: "Today, 5:41 AM" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All"); 
  const itemsPerPage = 5;
  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); 
  };


  const filteredData =
    selectedFilter === "All"
      ? historyData
      : historyData.filter((entry) => entry.type === selectedFilter);


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="user-history-container">
      <Navbar />
      <h2>USER HISTORY</h2>
      <div className="history-table-container">
        <div className="filter-buttons">
          <button
            id={selectedFilter === "All" ? "selected" : ""}
            onClick={() => handleFilterClick("All")}
          >
            All
          </button>
          <button
            id={selectedFilter === "Step" ? "selected" : ""}
            onClick={() => handleFilterClick("Step")}
          >
            Steps
          </button>
          <button
            id={selectedFilter === "Workout" ? "selected" : ""}
            onClick={() => handleFilterClick("Workout")}
          >
            Workouts
          </button>
          <button
            id={selectedFilter === "Weight" ? "selected" : ""}
            onClick={() => handleFilterClick("Weight")}
          >
            Weight
          </button>
        </div>

        <table className="user-history-table">
          <thead className="history-layout-headings">
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>User</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.item}</td>
                <td>{entry.type}</td>
                <td>{entry.user}</td>
                <td>{entry.date}</td>
                <td>
                  <button className="more-details-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default History;
