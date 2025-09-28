import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAZzjN0FNDYysW1kEuS1lAiJqmF420Ajqo",
  authDomain: "glowy-31b8a.firebaseapp.com",
  projectId: "glowy-31b8a",
  storageBucket: "glowy-31b8a.firebasestorage.app",
  messagingSenderId: "674575106901",
  appId: "1:674575106901:web:cf79a3efaf8af1e777e5dc",
  measurementId: "G-KKHQPT1F1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
