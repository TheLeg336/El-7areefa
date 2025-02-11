// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBDPjNAuc8ScJ2oqH4sISXQ1jZEdUnxTc",
  authDomain: "compassapp11.firebaseapp.com",
  projectId: "compassapp11",
  storageBucket: "compassapp11.firebasestorage.app",
  messagingSenderId: "223152942317",
  appId: "1:223152942317:web:37cbeadf1fb4b34ad130e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };