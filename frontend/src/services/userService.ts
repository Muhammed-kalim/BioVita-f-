import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: "patient" | "doctor";
  photoURL?: string;
  createdAt: any;
}

export const userService = {
  /**
   * Fetches a user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  },

  /**
   * Creates a new user profile in Firestore
   */
  async createUserProfile(profile: Omit<UserProfile, "createdAt">): Promise<void> {
    const userRef = doc(db, "users", profile.uid);
    await setDoc(userRef, {
      ...profile,
      createdAt: new Date().toISOString(),
    });
  }
};
