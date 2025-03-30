import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./History.css";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All"); 
  const itemsPerPage = 5;
  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  useEffect(() => {
    const getData = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
        } else {
            console.error("No authenticated user found.");
        }
    });

    return () => getData();
  }, []);

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!user) return; 
  
      try {
          const historyDoc = await getDoc(doc(db, "userHistory", user.uid));
          
          if (historyDoc.exists()) {
              const fetchedData = historyDoc.data();
              
              if (Array.isArray(fetchedData.history)) {
                const formattedData = fetchedData.history.map(entry => ({
                    item: entry.item,
                    type: entry.type,
                    user: entry.user,
                    date: new Date(entry.date).toLocaleString("en-US", {
                        weekday: 'long', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: true
                    }),
                    details: entry.details
                }));
        
                setHistoryData([...formattedData]);
                
                
            } else {
                setHistoryData([]); 
            }

          }
      } catch (error) {
          console.error("Error fetching history data:", error);
      }
  };

    if (user) {
        fetchHistoryData(); 
    }
}, [user]);

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
            {currentPageData.length > 0 ? (
              currentPageData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.item}</td>
                  <td>{entry.type}</td>
                  <td>{entry.user}</td>
                  <td>{entry.date}</td>
                  <td>
                    <button className="more-details-btn" onClick={openModal}>View Details</button>
                  </td>
                  {isModalOpen && (
          <div className="modal-overlay-history">
            <div className="modal-content-history">
              <h3>View Details</h3>
              <p>Details about user history</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
                </tr>
              ))
              
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>
                  No history yet!
                </td>
              </tr>
            )}
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
