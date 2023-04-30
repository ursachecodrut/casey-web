import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { AuthDto } from '../dtos';
import { auth, facebookProvider, googleProvider } from '../firebase/firebase';

export const signUp = async (dto: AuthDto) => {
  return createUserWithEmailAndPassword(auth, dto.email, dto.password);
};

export const signIn = async (dto: AuthDto) => {
  return signInWithEmailAndPassword(auth, dto.email, dto.password);
};

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = async () => {
  return signInWithPopup(auth, facebookProvider);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
