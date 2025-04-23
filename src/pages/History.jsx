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
  const [selectedDetails, setSelectedDetails] = useState("");

  //Shows details if user clicks the details button 
  //for a specific entry in the table
  const openModal = (details) => {
    setSelectedDetails(details);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetails("");
  };

  useEffect(() => {
    const getData = onAuthStateChanged(auth, async (currentUser) => {

      //Checks if user is currently logged in
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
        //Gets user history data if they have ever logged anything with the app
          const historyDoc = await getDoc(doc(db, "userHistory", user.uid));
          
          if (historyDoc.exists()) {
              const fetchedData = historyDoc.data();
              
              //Formats date
              if (Array.isArray(fetchedData.history)) {
                const formattedData = fetchedData.history.map(entry => ({
                    item: entry.item,
                    type: entry.type,
                    user: entry.user,
                    date: new Date(entry.date).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",   
                      month: "2-digit",  
                      day: "2-digit",    
                      hour: "2-digit", 
                      minute: "2-digit", 
                      hour12: true      
                    }),
                    details: entry.details
                }));
        
                setHistoryData([...formattedData.reverse()]);
                
                
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

//Following two functions handle switching between pages
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
                    <button className="more-details-btn" onClick={() => openModal(entry.details)}>
                      View Details
                    </button>
                  </td>
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
      {isModalOpen && (
        <div className="modal-overlay-history">
          <div className="modal-content-history">
            <p>{selectedDetails}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
