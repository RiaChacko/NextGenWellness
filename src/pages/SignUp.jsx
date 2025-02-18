import logo from "../assets/welcome-to.svg";
import { Link } from "react-router-dom";
import "../pages/SignUp.css";


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
            </form>

          </div>

      </div>
    );
}

export default SignUp;