// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // For Firebase Auth
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV9RMYBGCRh4uxzqcDZjrrepvbPHbW5Ws",
  authDomain: "nextgenwellness-af6f7.firebaseapp.com",
  projectId: "nextgenwellness-af6f7",
  storageBucket: "nextgenwellness-af6f7.firebasestorage.app",
  messagingSenderId: "889965078819",
  appId: "1:889965078819:web:d93047cc07e13909374496",
  measurementId: "G-CJY6VC1T01",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
