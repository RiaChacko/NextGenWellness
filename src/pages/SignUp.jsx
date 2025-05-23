import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import logo from "../assets/welcome-to.svg";;
import googleLogo from "../assets/google-lg.png";

import "../pages/SignUp.css";
import google from "../assets/google-lg.png";

function SignUp () {
// initialize variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSignupEmailPassword = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    setErrorMessage("");

    if (!name && !email && !password && !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      setShowAlert(true);
      return;
    }
    else if (!name) {
      setErrorMessage("Please fill in name field.");
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
    else if (!confirmPassword) {
      setErrorMessage("Please fill in password confirmation fields.");
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setShowAlert(true);
      return;
    }
// creates a user in backend
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        userId: userCredential.user.uid,
        name: name,
        email: email,
        signupMethod: "email/password",
        createdAt: serverTimestamp(),
      });

      navigate("/questionnaire");
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };
// handles google signup
  const handleGoogleSignUp = async () => {
    setShowAlert(false);
    setErrorMessage("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        name: user.displayName || "",
        email: user.email,
        signupMethod: "google",
        createdAt: serverTimestamp(),
      });

      navigate("/questionnaire");
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };
//html structure for signup 
    return(
      <div className="signup-page">
          <div className="center-s">
            <img src={logo}></img>
          </div>

          <div className="center-s title-s">
            <h1 className="pink-s">NEXT-GEN&nbsp;</h1>
            <h1 className="blue-s">WELLNESS</h1>
          </div>

          <div className="center-s">
            <button className="sign-s switch-s" type="button">SIGN UP</button>
            <a href="/login">
              <button className="log-s switch-s" type="button" id="login">LOG IN</button>
            </a>
            
          </div>

          <div className="text-input-s center-s">
            <form onSubmit={handleSignupEmailPassword}>

              <div className="center-s">
                <input type="name" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" size={40} required></input>
              </div>

              <div className="center-s">
                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" size={40} required></input>
              </div>

              <div>
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" size={17} required></input>
                <input type="password" name="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" size={17} required></input>
              </div>

              <button type="submit" className="center-s create-account-s">CREATE ACCOUNT</button>
              
              <div className="center-s google-section-s">
                <button onClick={handleGoogleSignUp} className="google-s">
                  <img id="google-img" src={google}  style={{ width: "2rem", height: "auto" }}></img> 
                  Sign up with Google</button> 
              </div>
                      
            </form>
            
          </div>

      </div>
    );
}

export default SignUp;
