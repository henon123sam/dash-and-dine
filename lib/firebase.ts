import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5H1A8caAaMwTp1tAQJXon8Gtqi5UxGic",
  authDomain: "dine-and-dash-79162.firebaseapp.com",
  projectId: "dine-and-dash-79162",
  storageBucket: "dine-and-dash-79162.firebasestorage.app",
  messagingSenderId: "764825062183",
  appId: "1:764825062183:web:ebdac93aa05c212515b702",
  measurementId: "G-VRMVCWJQWH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();