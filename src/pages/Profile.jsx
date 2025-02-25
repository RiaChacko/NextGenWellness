import "../pages/Profile.css";
import Navbar from '../pages/Navbar.jsx';

function Profile () {
    return(
        <div className="profile-container">
            <Navbar />
            <div className="profile-page">
                <div className="profile-content">
                    <div className="profile-card">
                        <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRoHDdcekKSGl-5gzbOJNeVbtgpqdwhljlrkYDIw9I58UA2r81dnE_Pof4_E5IQhzLpM5PMKsKP5OIR4aAZwz8zpg" alt="Profile" className="profile-image" />
                        <h2>BOB ROSS</h2>
                        <p>bobross@gmail.com</p>
                        <button className="logout-button">LOG OUT</button>
                        <a href='/delete-account'>
                            <button className="delete-button">DELETE ACCOUNT</button>
                        </a>
                        
                    </div>
                    <div className="edit-profile-card">
                        <h2 className="edit-profile-title">EDIT PROFILE</h2>
                        <div className="input-group">
                            <label>NAME</label>
                            <input type="text" value="Bob Ross" readOnly />
                            <button className="change-button">CHANGE NAME</button>
                        </div>
                        <div className="input-group">
                            <label>EMAIL</label>
                            <input type="email" value="bobross@gmail.com" readOnly />
                            <button className="change-button">CHANGE EMAIL</button>
                        </div>
                        <div className="input-group">
                            <label>PASSWORD</label>
                            <input type="password" value="************" readOnly />
                        </div>
                        <div className="input-group">
                            <label>CONFIRM NEW PASSWORD</label>
                            <input type="password" placeholder="New Password" />
                            <button className="change-button">CHANGE PASSWORD</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;