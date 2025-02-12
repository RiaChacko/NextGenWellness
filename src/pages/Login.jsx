import { Link } from "react-router-dom";
import logo from "../assets/login-logo.png";
import "../pages/Login.css";
function Login () {
    return(

    <div class="entire-pg">
        <div class="top-header-form">
            <img class="mx-auto h-10 w-auto" src={logo} alt="Your Company"/>
            <h2>NEXT-GEN &nbsp; WELLNESS</h2>
            
            
    </div>
    <div className="buttons">
      <button>SIGN UP</button>
      <button id="selected">LOGIN</button>
    </div>
    <div class="form-field">
        <form class="space-y-6" action="#" method="POST">
    <div>
        {/* <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label> */}
        <div class="mt-2">
          <input type="email" placeholder="Email Address" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          {/* <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label> */}
          <div class="text-sm">
            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input type="password" placeholder="Password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
        </div>
      </div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Not a member? 
      <Link to="/signup" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign Up</Link>
    </p>
  </div>
</div>
    );
}

export default Login;