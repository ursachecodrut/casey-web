import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
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
import { AuthDto } from '../dtos';
import { auth } from '../firebase/firebase';

type AuthState = {
  loading: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  signUp: (dto: AuthDto) => Promise<UserCredential>;
  signIn: (dto: AuthDto) => Promise<UserCredential>;
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

  const rememberMe = useCallback((persist: boolean) => {
    return setPersistence(
      auth,
      persist ? browserLocalPersistence : browserSessionPersistence
    );
  }, []);

  const signUp = useCallback(
    async (dto: AuthDto) => {
      await rememberMe(dto.persist);

      return createUserWithEmailAndPassword(auth, dto.email, dto.password);
    },
    [rememberMe]
  );

  const signIn = useCallback(
    async (dto: AuthDto) => {
      await rememberMe(dto.persist);

      return signInWithEmailAndPassword(auth, dto.email, dto.password);
    },
    [rememberMe]
  );

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
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      loading,
      currentUser,
      setCurrentUser,
      signIn,
      signUp,
      logout,
      signInWithGoogle,
      signInWithFacebook,
      resetPassword,
    }),
    [
      loading,
      currentUser,
      setCurrentUser,
      signIn,
      signUp,
      logout,
      signInWithFacebook,
      signInWithGoogle,
      resetPassword,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
