import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfigData from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfigData);

// Auth instance
export const auth = getAuth(app);

// Firestore instance with custom database ID from configuration
export const db = getFirestore(
  app,
  firebaseConfigData.firestoreDatabaseId || undefined
);

// Firebase Storage instance
export const storage = getStorage(app);

export const firebaseConfig = firebaseConfigData;
export default app;
