import Navbar from "./Navbar";
import "../pages/Dashboard.css";
import CircularProgress from "./CircularProgressBar";
import bell from "../assets/bell.svg";
function Dashboard () {
    return(
        <div className="dashboard-container">
            <Navbar/>
            <div className="top-header-dashboard">
                <h3>WELCOME BACK BOB!</h3>
                <div className="metrics-header">
                    <div className="metric-header">
                        <h4>Weight</h4>
                        <p>86 kg</p>
                    </div>
                    <div className="metric-header">
                        <h4>Height</h4>
                        <p>5'6</p>
                    </div>
                    <div className="metric-header">
                        <h4>Age</h4>
                        <p>23</p>
                    </div>
                </div>
                <div className="icons-dashboard">
                    <i className="fa-solid fa-bell" style={{ color: "white", fontSize: "1.5rem" }}></i>
                    <i className="fa-solid fa-search" style={{ color: "white", fontSize: "1.5rem" }}></i>
                </div>
            </div>
            <div className="dashboard-content-space">
                <div className="dashboard-metrics-container">
                    <div className="metric-content">
                    <h3>METRICS</h3>
                        <div className="metric-content-inner">
                            <p>Calories Burned</p>
                            <span>31.2%</span>
                        </div>
                        <div className="metric-content-inner">
                            <p>Carbs</p>
                            <span>23.2%</span>
                        </div>
                        <div className="metric-content-inner">
                            <p>Proteins</p>
                            <span>11.9%</span>
                        </div>
                        <button className="metrics-btn">VIEW ALL METRICS</button>
                    </div>
                    <div className="progress-bar-dashboard">
                        <CircularProgress/>
                    </div>
                  
                </div>
            </div>
           
        </div>
    );
}

export default Dashboard;