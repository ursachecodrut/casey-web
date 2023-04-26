import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { AuthDto } from '../dtos';
import { auth, facebookProvider, googleProvider } from '../firebase/firebase';

export const signUp = async (dto: AuthDto) => {
  createUserWithEmailAndPassword(auth, dto.email, dto.password);
};

export const signIn = async (dto: AuthDto) => {
  signInWithEmailAndPassword(auth, dto.email, dto.password);
};

export const signInWithGoogle = async () => {
  signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = async () => {
  signInWithPopup(auth, facebookProvider);
};

export const resetPassword = async (email: string) => {
  sendPasswordResetEmail(auth, email);
};
