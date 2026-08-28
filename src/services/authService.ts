import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import type { UserRole } from "../types";

export interface AuthUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  isPlatformAdmin: boolean;
  isTenantAdmin: boolean;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const determineUserRole = (email: string): UserRole => {
  const normalized = (email || "").toLowerCase().trim();
  // Primary platform owner and administrator
  if (
    normalized === "davmuchiri48@gmail.com" ||
    normalized.includes("davetech") ||
    normalized.endsWith("@davetech.co.ke")
  ) {
    return "platform_super_admin";
  }
  if (normalized.includes("admin")) {
    return "tenant_admin";
  }
  if (normalized.includes("teacher") || normalized.includes("educator")) {
    return "teacher";
  }
  if (normalized.includes("finance") || normalized.includes("bursar")) {
    return "accountant";
  }
  return "platform_admin";
};

export const mapFirebaseUser = (user: FirebaseUser): AuthUserProfile => {
  const role = determineUserRole(user.email || "");
  return {
    uid: user.uid,
    email: user.email || "davmuchiri48@gmail.com",
    displayName: user.displayName || user.email?.split("@")[0] || "David Muchiri",
    photoURL: user.photoURL || undefined,
    role,
    isPlatformAdmin: role === "platform_super_admin" || role === "platform_admin",
    isTenantAdmin: role === "platform_super_admin" || role === "tenant_admin",
  };
};

export const signInWithGoogle = async (): Promise<AuthUserProfile> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (err) {
    console.warn("Persistence setting error:", err);
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return mapFirebaseUser(result.user);
  } catch (error: any) {
    console.error("Google sign-in popup error:", error);
    // If popup is blocked in iframe environment, offer fallback or redirect
    if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        console.error("Google redirect sign-in error:", redirectErr);
      }
    }
    throw error;
  }
};

export const checkRedirectResult = async (): Promise<AuthUserProfile | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return mapFirebaseUser(result.user);
    }
  } catch (err) {
    console.error("Check redirect result error:", err);
  }
  return null;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem("davetech_auth_session");
  } catch (err) {
    console.error("Sign out error:", err);
    throw err;
  }
};

export const subscribeToAuth = (
  callback: (user: AuthUserProfile | null, rawUser: FirebaseUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const profile = mapFirebaseUser(firebaseUser);
      callback(profile, firebaseUser);
    } else {
      callback(null, null);
    }
  });
};
