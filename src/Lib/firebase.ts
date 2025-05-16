import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1bFbwVVzZ3H543TUXTAuhfaUTX_CDhR0",
  authDomain: "restaurant-2e036.firebaseapp.com",
  projectId: "restaurant-2e036",
  storageBucket: "restaurant-2e036.firebasestorage.app",
  messagingSenderId: "500452970795",
  appId: "1:500452970795:web:bb8656809c35574fb8f56e",
  measurementId: "G-S3705Q9RGT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
