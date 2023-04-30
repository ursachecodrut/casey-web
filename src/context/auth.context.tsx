/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

interface AuthState {
  currentUser: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({} as AuthState);

interface Props {
  children: JSX.Element;
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('isAuthenticated');
    setCurrentUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        setCurrentUser(user);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ currentUser, logout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
