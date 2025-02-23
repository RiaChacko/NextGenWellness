import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";


import logo from "../assets/welcome-to.svg";
import "../pages/Questionnaire.css";

function Questionnaire() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState(""); 
//   const [error, setError] = useState(""); 

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage("Password reset email sent. Please check your inbox.");
//     } catch (err) {
//       setError(err.message);
//     }
//   };
const [gender, setGender] = useState("");
const [height, setHeight] = useState("");
const [weight, setWeight] = useState("");
const [age, setAge] = useState("");

const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  return (
    <div className="entire-page-q">
      {/* <div className="center">
        <img src={logo} alt="Logo" />
      </div> */}

      <div className="center-q title-q">
        <h1 className="pink-q">NEXT-GEN&nbsp;</h1>
        <h1 className="blue-q">WELLNESS</h1>
      </div>
      <h1 className="title2">CONTINUE SETTING UP YOUR PROFILE</h1>
      <div className="whole-content">
        <h3>SELECT YOUR GENDER:</h3>
        <div className="gender-choices">
            <button className={`female ${gender === "female" ? "f-selected" : ""}`}
            onClick={() => handleGenderSelect("female")}>FEMALE</button>
            <button className={`male ${gender === "male" ? "m-selected" : ""}`}
            onClick={() => handleGenderSelect("male")}>MALE</button>
            <button className={`prefer ${gender === "prefer" ? "p-selected" : ""}`}
            onClick={() => handleGenderSelect("prefer")}>PREFER NOT TO SAY</button>
        </div>
        <h3>PERSONAL INFORMATION:</h3>
        <div className="bio-metrics">
          
        </div>
      </div>


      {/* <div className="center">
        <button className="sign switch" type="button">
          FORGOT PASSWORD
        </button>
        <Link to="/login">
          <button className="log switch" type="button" id="login">
            LOG IN
          </button>
        </Link>
      </div> */}

      {/* <div className="text-input center">
        <form onSubmit={handleForgotPassword}>
          <div className="center">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              size={40}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="center create-account">
            SEND RESET EMAIL
          </button>
        </form>

        {message && (
          <p className="center" style={{ color: "green" }}>
            {message}
          </p>
        )}
        {error && (
          <p className="center" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div> */}
{/* 
      <div className="center google-section-s">
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div> */}
    </div>
  );
}

export default Questionnaire;

