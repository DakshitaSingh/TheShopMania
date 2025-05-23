// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2CfjglUr2ip5dVzqEIZu4owXY8UZwCB4",
  authDomain: "shopmania-423f7.firebaseapp.com",
  projectId: "shopmania-423f7",
  storageBucket: "shopmania-423f7.firebasestorage.app",
  messagingSenderId: "1013727425269",
  appId: "1:1013727425269:web:c321aa3faddb347efacbbc",
  measurementId: "G-L3R8TKVW9V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
const auth = getAuth(app);

const db = getFirestore(app);

// (Optional) Initialize Analytics if running in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, analytics, app, db };
