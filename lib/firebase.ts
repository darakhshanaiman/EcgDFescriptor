import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKV4sNIEj0iGCyzafMO604TKtjDXwjKBg",
  authDomain: "ecgdescriptor2.firebaseapp.com",
  projectId: "ecgdescriptor2",
  storageBucket: "ecgdescriptor2.firebasestorage.app",
  messagingSenderId: "444084290777",
  appId: "1:444084290777:web:d48ccf3e7dbfa2e66aeac8",
  measurementId: "G-E5J6C269WM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);