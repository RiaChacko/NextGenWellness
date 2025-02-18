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

export default SignUp;