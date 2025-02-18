import { Link } from "react-router-dom";
import logo from "../assets/login-logo.png";
import "../pages/Login.css";
function Login () {
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