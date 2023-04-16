import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LoginDto } from '../dtos';
import { auth } from '../firebase/firebase';

type AuthState = {
  loading: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  register: (dto: LoginDto) => Promise<UserCredential>;
  login: (dto: LoginDto) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithFacebook: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthState>({} as AuthState);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);
  const facebookProvider = useMemo(() => new FacebookAuthProvider(), []);
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  facebookProvider.setCustomParameters({ prompt: 'select_account' });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = (dto: LoginDto) => {
    return createUserWithEmailAndPassword(auth, dto.email, dto.password);
  };

  const login = (dto: LoginDto) => {
    return signInWithEmailAndPassword(auth, dto.email, dto.password);
  };

  const signInWithGoogle = useCallback(() => {
    return signInWithPopup(auth, googleProvider);
  }, [googleProvider]);

  const signInWithFacebook = useCallback(() => {
    return signInWithPopup(auth, facebookProvider);
  }, [facebookProvider]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    return signOut(auth);
  }, []);

  const resetPassword = useCallback((email: string) => {
    return sendPasswordResetEmail(auth, email);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // const value = useMemo(() =>  return , []);

  const value = useMemo(
    () => ({
      loading,
      currentUser,
      setCurrentUser,
      login,
      register,
      signInWithGoogle,
      signInWithFacebook,
      logout,
      resetPassword,
    }),
    [
      currentUser,
      loading,
      logout,
      resetPassword,
      signInWithFacebook,
      signInWithGoogle,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
