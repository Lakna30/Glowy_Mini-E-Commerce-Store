import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const ADMIN_EMAILS = ['admin@gmail.com'];

  // 🔹 SIGNUP
    async function signup(email, password, additionalData = {}) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

        // Update Firebase Auth profile (best-effort)
        try {
          if (additionalData.firstName || additionalData.lastName) {
            await updateProfile(user, {
              displayName: `${additionalData.firstName || ''} ${additionalData.lastName || ''}`.trim()
            });
          }
        } catch (profileError) {
          console.warn('Profile update failed:', profileError);
        }

        // Create Firestore user document (best-effort)
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            fullName: additionalData.firstName || '',
            role: 'user'
          });
        } catch (firestoreError) {
          console.warn('Firestore user doc creation failed:', firestoreError);
        }

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // 🔹 LOGIN
  async function login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // 🔹 GOOGLE SIGN-IN
    async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const [firstName, ...rest] = (user.displayName || '').split(' ');
        const lastName = rest.join(' ');
          try {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email || '',
              fullName: firstName || '',
              role: 'user'
            });
          } catch (firestoreError) {
            console.warn('Firestore user doc creation failed (Google):', firestoreError);
          }
      }

      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // 🔹 LOGOUT
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // 🔹 UPDATE USER PROFILE
  async function updateUserProfile(updates) {
    try {
      if (currentUser) {
        await updateProfile(currentUser, updates);
        await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // 🔹 GET USER DATA
  async function getUserData() {
    try {
      if (!currentUser) return null;
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // 🔹 AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setRole(data.role || (ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user'));
        } else {
          setRole(ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user');
        }
      } catch (error) {
        console.warn('Failed to fetch role:', error);
        setRole(ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    role,
    signup,
    login,
    logout,
    googleSignIn,
    updateUserProfile,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
