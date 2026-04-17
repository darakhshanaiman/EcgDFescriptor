import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCb6IynXaWiOZ8GCkavieGGDPrA0aZMEMM",
  authDomain: "lifeline-2e96d.firebaseapp.com",
  projectId: "lifeline-2e96d",
  storageBucket: "lifeline-2e96d.firebasestorage.app",
  messagingSenderId: "396635906800",
  appId: "1:396635906800:web:b14ca1e1f6f975856c1835",
  measurementId: "G-YVPLL9DY4K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();