import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import defaultFirebaseConfig from "../../firebase-applet-config.json";

// Environment variable resolution with fallback to bundled config
const env: Record<string, string | undefined> =
  (typeof import.meta !== "undefined" && (import.meta as any).env) || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId || "",
  firestoreDatabaseId:
    env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
    env.VITE_FIREBASE_DATABASE_ID ||
    defaultFirebaseConfig.firestoreDatabaseId ||
    undefined,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Firestore instance with custom database ID from configuration
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || undefined
);

// Firebase Storage instance
export const storage = getStorage(app);

export default app;
