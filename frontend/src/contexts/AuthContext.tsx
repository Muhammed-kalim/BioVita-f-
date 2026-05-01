import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
    } catch (error: any) {
      // If it's a permission error, it's likely because the document doesn't exist 
      // and the rules are strict, or the collection name is incorrect.
      if (error.code === 'permission-denied') {
        console.warn('ℹ️ [AuthContext] User document not found or access denied. This is normal if the user profile hasn\'t been created in Firestore yet.');
      } else {
        console.error('❌ [AuthContext] Error fetching user data:', error);
      }
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signOut, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
