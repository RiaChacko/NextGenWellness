
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import GoalSetting from './pages/GoalSetting.jsx';


function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/goals' element={<GoalSetting/>}/>
        </Routes>

      </Router>
    
    </>
  )
}

export default App
