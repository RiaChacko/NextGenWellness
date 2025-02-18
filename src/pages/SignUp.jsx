import logo from "../assets/welcome-to.svg";
import { Link } from "react-router-dom";
import "../pages/SignUp.css";
import google from "../assets/google-lg.png";


function SignUp () {
    return(
      <div className="entire-page">
          <div className="center">
            <img src={logo}></img>
          </div>

          <div className="center title">
            <h1 className="pink">NEXT-GEN&nbsp;</h1>
            <h1 className="blue">WELLNESS</h1>
          </div>

          <div className="center">
            <button className="sign switch" type="button">SIGN UP</button>
            <a href="/login">
              <button className="log switch" type="button" id="login">LOG IN</button>
            </a>
            
          </div>

          <div className="text-input center">
            <form action="/submit" method="POST">

              <div className="center">
                <input type="name" name="name" id="name" placeholder="Name" size={40} required></input>
              </div>

              <div className="center">
                <input type="email" name="email" id="email" placeholder="Email" size={40} required></input>
              </div>

              <div>
                <input type="password" name="password" id="password" placeholder="Password" size={17} required></input>
                <input type="password" name="password" id="confirm-password" placeholder="Confirm Password" size={17} required></input>
              </div>

              <button type="submit" className="center create-account">CREATE ACCOUNT</button>
              
              <div className="center google-section-s">
                <button type="submit" className="google-s">
                  <img id="google-img" src={google}  style={{ width: "2rem", height: "auto" }}></img> 
                  Sign up with Google</button> 
              </div>
                      
            </form>
            
           

          </div>

      </div>
    );
}

export default SignUp;