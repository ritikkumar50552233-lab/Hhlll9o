import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  role: 'admin' | 'analyst' | 'viewer';
  preferences: {
    theme: 'dark' | 'light';
    defaultRegion: string;
    emailAlerts: boolean;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'admin' | 'analyst' | 'viewer') => void;
  signup: (name: string, email: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('worldveil_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      uid: 'user-ayush-yadav-01',
      displayName: 'Ayush Yadav (Founder)',
      email: 'ayush@worldveil.intelligence',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
      role: 'admin',
      preferences: {
        theme: 'dark',
        defaultRegion: 'Global',
        emailAlerts: true
      }
    };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userRef);
        let profile: UserProfile;
        if (snap.exists()) {
          profile = snap.data() as UserProfile;
        } else {
          profile = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Analyst',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
            role: fbUser.email?.includes('admin') ? 'admin' : 'analyst',
            preferences: { theme: 'dark', defaultRegion: 'Global', emailAlerts: true }
          };
          await setDoc(userRef, profile);
        }
        setUser(profile);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('worldveil_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('worldveil_user');
    }
  }, [user]);

  const login = (email: string, role: 'admin' | 'analyst' | 'viewer' = 'analyst') => {
    const newUser: UserProfile = {
      uid: `usr-${Date.now()}`,
      displayName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      createdAt: new Date().toISOString(),
      role,
      preferences: { theme: 'dark', defaultRegion: 'Global', emailAlerts: true }
    };
    setUser(newUser);
  };

  const signup = (name: string, email: string) => {
    const newUser: UserProfile = {
      uid: `usr-${Date.now()}`,
      displayName: name,
      email,
      createdAt: new Date().toISOString(),
      role: email.includes('admin') ? 'admin' : 'analyst',
      preferences: { theme: 'dark', defaultRegion: 'Global', emailAlerts: true }
    };
    setUser(newUser);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const profile: UserProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'Google Analyst',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
        role: 'analyst',
        preferences: { theme: 'dark', defaultRegion: 'Global', emailAlerts: true }
      };
      await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
      setUser(profile);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      // Fallback demo user
      signup('Ayush Yadav', 'ayush@worldveil.intelligence');
    }
  };

  const logout = () => {
    fbSignOut(auth).catch(() => {});
    setUser(null);
  };

  const updatePreferences = (prefs: Partial<UserProfile['preferences']>) => {
    if (!user) return;
    setUser({
      ...user,
      preferences: { ...user.preferences, ...prefs }
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, loginWithGoogle, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
