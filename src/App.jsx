
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import GoalSetting from './pages/GoalSetting.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Navbar from './pages/Navbar.jsx';
import Motivation from './pages/Motivation.jsx';
import DeleteAccount from './pages/DeleteAccount.jsx';
import Log from './pages/Log.jsx';

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
          <Route path='/delete-account' element={<DeleteAccount/>}/>
          <Route path='/goals' element={<GoalSetting/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/questionnaire' element={<Questionnaire/>}/>
          <Route path='/navbar' element={<Navbar/>}/>
          <Route path='/motivation' element={<Motivation/>}/>
          <Route path='/log' element={<Log/>}/>
        
        </Routes>

      </Router>
    
    </>
  )
}

export default App
