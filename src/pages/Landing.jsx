
import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import svglogo from "../assets/Icon.svg";
import heroPic from "../assets/landingpic2.png";
function Landing() {

    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path); 
    };

    return(
        <div className="landing-container">
            <div className="navbar">
                <div className="logo-name">
                    <img src={svglogo}></img>
                    <div className="title-la">
                        <h1 className="pink-la">NEXT-GEN&nbsp;</h1>
                        <h1 className="blue-la">WELLNESS</h1>
                    </div>
                </div>
                <div className="nav-links">
                    <a>Home</a>
                    <a>About us</a>
                   <Link to="/signup"><a>Sign up</a></Link> 
                   <Link to="/login"><a>Login</a></Link> 
                    <a>Contact Us</a>
                </div>

            </div>

            <div className="hero-section">
                <h1>YOUR WELLNESS REIMAGINED</h1>
                <h3>Next-gen tools for next-level fitness. Track progress, stay accountable, and push your limits.</h3>
                <button>GET STARTED</button>
            </div>


            {/* <div className="main-content-l">
                <h1>Links to pgs for developers temporarily:</h1>
                <Link to="/login"><a>Login</a></Link>
                <Link to="/signup"><a>Signup</a></Link>
                <Link to="/forgot-password"><a>Forgot Password</a></Link>
                <Link to="/dashboard"><a>Dashboard</a></Link>
                <Link to="/questionnaire"><a>Questionnaire</a></Link>
                <Link to="/profile"><a>Profile</a></Link>
                <Link to="/navbar"><a>Navbar</a></Link>
                <Link to="/goals"><a>Goals</a></Link>
                <Link to="/motivation"><a>Motivation</a></Link>

            </div> */}
            
        </div>
        
    );
    
}

export default Landing