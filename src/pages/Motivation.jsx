import "../pages/Motivation.css"
import Navbar from "./Navbar";

function Motivation () {
    return(
        <div className="motivation-pg-container">
            <Navbar/>
            <h2>MOTIVATION</h2>
            <div className="why-motivaton-containers">
                <div className="why-container">
                    <h3>ADD YOUR WHY</h3>
                    <p>Why are you working out? What’s is the passion behind it?</p>
                    <button>Add Your Why</button>
                </div>
                <div className="motivation-container">
                    <h3>ADD MOTIVATIONAL QUOTES</h3>
                    <p>What quotes pique your motivation to workout?</p>
                    <button>Add Motivational Quote</button>
                </div>
            </div>
        </div>

    );
    

}
export default Motivation;