
import "./Landing.css";
import { useNavigate } from "react-router-dom";
function Landing() {

    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path); 
    };

    return(
        <div>
            <div className="text-3xl font-extrabold underline">
                <h1>Landing Page</h1>
            </div>

            <button onClick={() => handleClick('/login')}>
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

            
        </div>
        
    );
    
}

export default Landing