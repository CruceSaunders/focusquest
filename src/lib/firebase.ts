// Firebase configuration for FocusQuest
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfMGWtjijG0pV079Z6nqCTBLnZwA48iF4",
  authDomain: "focusquest-e5264.firebaseapp.com",
  projectId: "focusquest-e5264",
  storageBucket: "focusquest-e5264.firebasestorage.app",
  messagingSenderId: "923577836668",
  appId: "1:923577836668:web:ff93c625af903c8287d5f9",
  measurementId: "G-CMSKZ0KLC4"
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
