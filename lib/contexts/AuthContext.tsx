import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName: displayName
        });
        await result.user.reload();
        setUser(auth.currentUser);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const updateUserProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      await updateProfile(auth.currentUser, profile);
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      console.error('Password update error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const value = {
    user,
    currentUser: user,
    loading,
    signUp,
    logIn,
    logOut,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return 'An error occurred. Please try again.';
  }
}
