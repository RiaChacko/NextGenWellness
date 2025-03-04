import "../pages/Log.css";
import Navbar from "./Navbar";
import footsteps from "../assets/footsteps-icon.svg";
import scale from "../assets/scale-icon.svg";

function Log() {

    return(
        <div>
            <Navbar/>
            <div className="log-container">
                <h1>LOG DATA AND WORKOUTS</h1>

                <h2 className="log-workout-title">LOG A WORKOUT</h2>
                <div className="log-workout">
                    <div className="log-cardio">
                        <h3>CARDIO</h3>
                        <button>TREADMILL</button>
                        <button>STAIRMASTER</button>
                    </div>

                    <div className="log-strength">
                        <h3>STRENGTH TRAINING</h3>
                        <button>SQUATS</button>
                        <button>LAT PULLDOWNS</button>
                        <button>BICEP CURLS</button>
                        <button>SIT UPS</button>
                    </div>

                    <div className="log-yoga">
                        <h3>YOGA</h3>
                        <button>YOGA1</button>
                        <button>YOGA2</button>
                    </div>
                    
                </div>
                
                <h2 className="log-other-title">LOG OTHER DATA</h2>
                <div className="log-other">
                    <button>
                        <img className="footsteps-icon" src={footsteps}></img>
                        STEPS
                    </button>
                    <button>
                        <img className="scale-icon" src={scale}></img>
                        WEIGHT
                    </button>
                </div>
                
            </div>
        </div>
    );

}

export default Log;