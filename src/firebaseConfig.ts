// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyAYpG7bLHqMPOJMk0KGBmWEUXnysF0M5Rw',
  authDomain: 'ranked-scenarios.firebaseapp.com',
  projectId: 'ranked-scenarios',
  storageBucket: 'ranked-scenarios.firebasestorage.app',
  messagingSenderId: '577878945659',
  appId: '1:577878945659:web:9c83b9a05086a2f355d7de',
  measurementId: 'G-1SH3R03RCQ',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

export { auth, analytics, db, googleProvider, signInWithPopup, signOut, functions };
