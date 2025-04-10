
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDV9RMYBGCRh4uxzqcDZjrrepvbPHbW5Ws",
  authDomain: "nextgenwellness-af6f7.firebaseapp.com",
  projectId: "nextgenwellness-af6f7",
  storageBucket: "nextgenwellness-af6f7.firebasestorage.app",
  messagingSenderId: "889965078819",
  appId: "1:889965078819:web:d93047cc07e13909374496",
  measurementId: "G-CJY6VC1T01",
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
