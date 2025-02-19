// Importing necessary libraries and functionality
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// Importing logos
import logo from "../assets/login-logo.png";
import "../pages/Login.css";
import googlelogo from "../assets/google-lg.png";

// Implements login functionality
function Login () {


  // Setting variable to store input values onclick
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    setErrorMessage("");

    // Checks email and password fields for valid input
    if (!email && !password) {
      setErrorMessage("Please fill in both email and password.");
      setShowAlert(true);
      return;
    }
    else if (!email) {
      setErrorMessage("Please fill in email field.");
      setShowAlert(true);
      return;
    }
    else if (!password) {
      setErrorMessage("Please fill in password field.");
      setShowAlert(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Redirects user to dashboard page
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };

  // Implementing ‘login with google’ feature for ease
  const handleGoogleSignIn = async () => {
    setShowAlert(false);
    setErrorMessage("");

    try {
      await signInWithPopup(auth, googleProvider);
      
      // Redirects user to dashboard page
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };
  
  return(
    <div className="entire-page-l">
        <div className="center-l">
          <img src={logo}></img>
        </div>

        <div className="center-l title-l">
          <h1 className="pink-l">NEXT-GEN&nbsp;</h1>
          <h1 className="blue-l">WELLNESS</h1>
        </div>

        <div className="center-l">
        <a href="/signup">
          <button className="sign-l switch-l" type="button">SIGN UP</button>
          </a>
            <button className="log-l switch-l" type="button" id="login-l">LOG IN</button>
          
          
        </div>

        <div className="text-input-l center-l">
          <form action="/submit" method="POST">
            {/* <div className="center-l">
              <input type="name" name="name" id="name" placeholder="Name" size={40} required></input>
            </div> */}
            <div className="center-l">
              <input type="email" name="email" id="email" placeholder="Email" size={40} required></input>
            </div>
            <div>
              <input type="password" name="password" id="password" placeholder="Password" size={40} required></input>
              {/* <input type="password" name="password" id="confirm-password" placeholder="Confirm Password" size={17} required></input> */}
            </div>
            <button type="submit" className="center-l create-account-l">LOGIN</button>
            {/* <div className="sign-in-google">
              <img src={googlelogo}/>
              
            </div> */}
            <div className="center google-section-s">
            <button onClick={handleGoogleSignIn} className="google-s">
              <img id="google-img" src={googlelogo}  style={{ width: "2rem", height: "auto" }}></img>
              Sign in with Google</button>
            </div>
            
           
          </form>

        </div>


        
    
              {/* <div>
                <h2>HELLO</h2>
              <div>
                  <img  alt="Your Company"/>
                  <h2>Register for Account</h2>
          </div>

          <div>
              <form action="#" method="POST">
          <div>
              <label for="email">Email address</label>
              <div>
                <input type="email" name="email" id="email" autocomplete="email" required/>
              </div>
            </div>
            <div>
              <label for="email">Name</label>
              <div>
                <input type="name" name="name" id="name" autocomplete="name" required/>
              </div>
            </div>

            <div>
              <div>
                <label for="password">Create a Password</label>
              </div>
              <div>
                <input type="password" name="password" id="password" autocomplete="current-password" required/>
              </div>
              
              <div class="mt-2">
              <label for="password">Confirm Password</label>
                <input type="password" name="password" id="confirmpassword" autocomplete="current-password" required/>
              </div>
              
            </div>

            <div>
              <button type="submit">Sign Up</button>
            </div>
          </form>

          <p>
            Already a Member? 
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div> */}

    </div>
  );
}

export default Login;