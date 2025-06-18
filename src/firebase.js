// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // <--- CHANGE THIS LINE!
  authDomain: "shopmania-423f7.firebaseapp.com",
  projectId: "shopmania-423f7",
  storageBucket: "shopmania-423f7.appspot.com",
  messagingSenderId: "1013727425269",
  appId: "1:1013727425269:web:c321aa3faddb347efacbbc",
  measurementId: "G-L3R8TKVW9V",
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Named exports
export { app, auth, db, analytics };