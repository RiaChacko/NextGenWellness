import { Link } from "react-router-dom";
import logo from "../assets/login-logo.png";
import "../pages/Login.css";
function Login () {
    return(
    <div class="entire-pg">
        <div class="top-header-form">
            <img class="mx-auto h-10 w-auto" src={logo} alt="Your Company"/>
            <h2 className="logo-title">
            <span className="nextgen">NEXTGEN</span>&nbsp;
            <span className="wellness">WELLNESS</span>
            </h2>
              
    </div>
    <div className="buttons">
    <Link to="/signup"><button>SIGN UP</button></Link> 
      <button id="selected">LOGIN</button>
    </div>
    <div class="form-field">
        <form action="#" method="POST">
    <div>
        {/* <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label> */}
        <div>
          <input type="email" placeholder="Email Address" name="email" id="email" autocomplete="email" required />
        </div>
      </div>

      <div>
        <div>
          {/* <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label> */}
          <div className="forgot-pass">
            <a href="#">Forgot password?</a>
          </div>
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" id="password" autocomplete="current-password" required />
        </div>
      </div>

      <div className="login-container">
        <button type="submit" class="login-button">LOG IN</button>
      </div>
    </form>

    
  </div>
</div>
    );
}

export default Login;