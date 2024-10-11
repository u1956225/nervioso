// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJEQu7tNXyhqBaKe7iJGrYrhh2HqLil1A",
  authDomain: "nervioso-2024.firebaseapp.com",
  projectId: "nervioso-2024",
  storageBucket: "nervioso-2024.appspot.com",
  messagingSenderId: "708817033156",
  appId: "1:708817033156:web:9104ef1cdaf91177d73691",
  measurementId: "G-HNH5ESR7MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Export the necessary modules
export { db, auth, analytics };
