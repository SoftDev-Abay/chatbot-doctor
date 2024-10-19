// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfwy_3hC1JkIfK36qUjgJNv0NCVskRb-E",
  authDomain: "decentrathon-chatbot-doctor.firebaseapp.com",
  projectId: "decentrathon-chatbot-doctor",
  storageBucket: "decentrathon-chatbot-doctor.appspot.com",
  messagingSenderId: "516498917450",
  appId: "1:516498917450:web:8aa40bc9d38399daf87eb3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
