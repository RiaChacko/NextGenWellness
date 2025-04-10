import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import logo from "../assets/login-logo.png";
import "../pages/Login.css";
import googlelogo from "../assets/google-lg.png";

function Login () {
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

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setShowAlert(false);
    setErrorMessage("");

    try {
      await signInWithPopup(auth, googleProvider);
      
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
          <form onSubmit={handleEmailSignIn}>
            <div className="center-l">
              <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" size={40} required></input>
            </div>
            <div>
              <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" size={40} required></input>
            </div>
            <button
                type="button"
                className="forgot flex-1"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            <button type="submit" className="center create-account-l flex-1">
                LOGIN
              </button>
            <div className="flex space-x-4 mt-4">
              
              
            </div>
            <div className="center google-section-s">
            <button onClick={handleGoogleSignIn} className="google-s">
              <img id="google-img" src={googlelogo}  style={{ width: "2rem", height: "auto" }}></img>
              Sign in with Google</button>
            </div>
           
          </form>

        </div>
    </div>
  );
}

export default Login;
