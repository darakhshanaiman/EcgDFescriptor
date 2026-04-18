import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Initialize Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();