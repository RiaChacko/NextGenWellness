import React, { useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../pages/Profile.css";
import Navbar from '../pages/Navbar.jsx';

function Profile () {

    const [deleteAccountConfirmMessage, setDeleteAccountConfirmMessage] = useState(false);

    const handleDeleteClick = () => {
        setDeleteAccountConfirmMessage(true);
    }

    const handleCancelClick = () => {
        setDeleteAccountConfirmMessage(false);
    }

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [newName, setNewName] = useState(""); 
    const [email, setEmail] = useState("");

    useEffect(() => {
        const getData = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser(currentUser);
                        setName(userData.name || "No name found");
                        setNewName(userData.name || ""); 
                        setEmail(userData.email || "No email found");
                    } else {
                        console.error("The user's document does not exist in the database.");
                    }
                } catch (error) {
                    console.error("There was an error fetching user data:", error);
                }
            } else {
                console.error("No authenticated user found.");
            }
            setLoading(false);
        });

        return () => getData();
    }, []);

    const handleChangeName = async () => {
        if (!newName || newName === name) return; 
        const user = auth.currentUser;

        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, { name: newName });

                setName(newName); 
            } catch (error) {
                console.error("Error updating name in Firestore:", error);
            }
        } else {
            console.error("No authenticated user found when updating name.");
        }
    };

    return (
        <div className="profile-container">
            <Navbar />
            <div className={`profile-page ${deleteAccountConfirmMessage ? 'blur-background' : ''}`}>
                <div className="profile-content">
                    <div className="profile-card">
                        <img 
                            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRoHDdcekKSGl-5gzbOJNeVbtgpqdwhljlrkYDIw9I58UA2r81dnE_Pof4_E5IQhzLpM5PMKsKP5OIR4aAZwz8zpg" 
                            alt="Profile" 
                            className="profile-image" 
                        />
                        <h2>{name}</h2> 
                        <p>{email}</p>
                        <button className="logout-button">LOG OUT</button>
                        <button className="delete-button" onClick={handleDeleteClick}>DELETE ACCOUNT</button>
                        
                    </div>
                    <div className="edit-profile-card">
                        <h2 className="edit-profile-title">EDIT PROFILE</h2>
                        <div className="input-group">
                            <label>NAME</label>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <button className="change-button" onClick={handleChangeName}>CHANGE NAME</button>
                        </div>
                        <div className="input-group">
                            <label>EMAIL</label>
                            <input type="email" value={email} readOnly />
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
            {deleteAccountConfirmMessage && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>ARE YOU SURE YOU WANT TO <span className="delete-text">DELETE</span> YOUR ACCOUNT?</p>
                        <div className="popup-buttons">
                            <button className="delete-button" onClick={handleDeleteClick}>DELETE ACCOUNT</button>
                            <button className="cancel-button" onClick={handleCancelClick}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;