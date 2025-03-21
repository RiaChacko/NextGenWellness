
import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import svglogo from "../assets/Icon.svg";
import heroPic from "../assets/landingpic2.png";
import dashboard from "../assets/dashboard.png";
import motivation from "../assets/motivation.png";
import fitnessplan from "../assets/fitnessplan.png";
import goalsetting from "../assets/goalsetting.png";
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
                    <a href="#features">Our Features</a>
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

            <div className="features">
                <h2 id="features">Our Features</h2>
                <p>Discover the powerful features that make our interactive dashboard the ultimate tool for your fitness journey. Designed to help you stay motivated, track your progress, and achieve your goals, our dashboard brings all your fitness needs into one easy-to-use platform.</p>
                <div className="features-list">
                    <div className="individual-feature">
                        <img src={dashboard}></img>
                        <div className="title-description-feature">
                        <h2>INTERACTIVE DASHBOARD</h2>
                        <p>A sleek, easy-to-navigate interface that provides a clear view of your workouts, performance, and achievements. Everything you need is just a click away.</p>
                        </div>
                    </div>
                    <div className="individual-feature">
                        <div className="title-description-feature-b">
                        <h2>MOTIVATION & SUPPORT</h2>
                        <p>Stay motivated with daily challenges, fitness quotes, and community engagement. Join our fitness community for extra support and encouragement along the way.</p>
                        </div>
                        <img src={motivation}></img>
                    </div>

                    <div className="individual-feature">
                        <img src={fitnessplan}></img>
                        <div className="title-description-feature">
                        <h2>PERSONALIZED FITNESS PLANS</h2>
                        <p>Get a tailored workout plan based on your fitness level and goals, whether you’re aiming to lose weight, build muscle, or improve endurance.</p>
                        </div>
                    </div>

                    <div className="individual-feature">
                        <div className="title-description-feature-b">
                        <h2>GOAL SETTING</h2>
                        <p>Achieving your fitness goals has never been easier. Our Goal Setting feature is designed to help you stay focused, motivated, and on track to reach your full potential.</p>
                        </div>
                        <img src={goalsetting}></img>
                    </div>
                </div>
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