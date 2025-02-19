
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import GoalSetting from './pages/GoalSetting.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';


function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/goals' element={<GoalSetting/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
        </Routes>

      </Router>
    
    </>
  )
}

export default App
