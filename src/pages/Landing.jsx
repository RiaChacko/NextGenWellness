
import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import svglogo from "../assets/Icon.svg";

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
                    <a>Sign up</a>
                    <a>Login</a>
                    <a>Contact Us</a>
                </div>

            </div>

            <div className="main-content-l">
                <h1>Links to pgs for developers temporarily:</h1>
                <Link to="/login"><a>Login</a></Link>
                <Link to="/signup"><a>Signup</a></Link>
                <Link to="/forgot-password"><a>Forgot Password</a></Link>
                <Link to="/dashboard"><a>Dashboard</a></Link>
                <Link to="/questionnaire"><a>Questionnaire</a></Link>
                <Link to="/profile"><a>Profile</a></Link>
                <Link to="/navbar"><a>Navbar</a></Link>
                <Link to="/goals"><a>Goals</a></Link>

            </div>
            {/* <div className="text-3xl font-extrabold underline">
                <h1>Landing Page</h1>
            </div> */}

            {/* <button onClick={() => handleClick('/login')}>
                Login
            </button>

            <button onClick={() => handleClick('/signup')}>
                Signup
            </button>

            <button onClick={() => handleClick('/dashboard')}>
                dashboard
            </button>

            <button onClick={() => handleClick('/profile')}>
                Profile
            </button>

            <button onClick={() => handleClick('/goals')}>
                Goal Setting
            </button>

            <button onClick={() => handleClick('/forgot-password')}>
                Forgot Password
            </button>

            <button onClick={() => handleClick('/questionnaire')}>
                Goals Questionnaire
            </button>

            <button onClick={() => handleClick('/navbar')}>
                Navbar
            </button>

             */}

        </div>
        
    );
    
}

export default Landing