import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../pages/Profile.css";
import Navbar from '../pages/Navbar.jsx';

function Profile () {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [newName, setNewName] = useState(""); 
    const [email, setEmail] = useState("");
    const [deleteAccountConfirmMessage, setDeleteAccountConfirmMessage] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("There was an error signing the user out:", error);
        }
    };

    const handleDeleteClick = () => {
        setDeleteAccountConfirmMessage(true);
    }

    const handleCancelClick = () => {
        setDeleteAccountConfirmMessage(false);
    }

    const handlePasswordReset = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email has been sent! Please check your inbox.");
        })
        .catch((error) => {
            console.error("There was an error sending password reset email:", error);
        });

    }

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
                    <div className="profile-image-container">
                        <div className="profile-initials">{name[0]}{name.split(" ")[1]?.[0]}</div> 
                    </div>
                        <h2>{name}</h2> 
                        <p>{email}</p>
                        <button className="logout-button" onClick={handleLogout}>LOG OUT</button>
                        <button className="delete-button" onClick={handleDeleteClick}>DELETE ACCOUNT</button>
                        
                    </div>
                    <div className="edit-profile-card">
                        <h2 className="edit-profile-title">EDIT PROFILE</h2>
                        <div className="input-group">
                            <label>NAME</label>
                            <input className="profile-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <button className="change-button" onClick={handleChangeName}>CHANGE NAME</button>
                        </div>
                        <div className="input-group">
                            <label>EMAIL</label>
                            <input className="profile-email" type="email" value={email} readOnly />
                        </div>
                        <div className="input-group">
                            <label>PASSWORD</label>
                            <input className="profile-password" type="password" value="************" readOnly />
                        </div>
                        <div className="input-group">
                            <button className="change-button " onClick={handlePasswordReset}>SEND PASSWORD RESET EMAIL</button>
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