import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AuthDto } from '../dtos';
import {
  auth,
  db,
  facebookProvider,
  googleProvider,
} from '../firebase/firebase';
import { handleFirebaseError } from '../firebase/firebase.errors';

const createShopping = async (uid: string) => {
  await setDoc(doc(db, 'shopping', uid), {
    current: {
      ingredients: [],
      updatedAt: Timestamp.now(),
    },
    history: [],
  });
};

const signUp = async (dto: AuthDto) => {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    dto.email,
    dto.password
  );

  const uid = credentials.user?.uid;

  if (!uid) {
    throw new Error('Error while creating user');
  }

  await setDoc(doc(db, 'users', uid), {
    uid,
    email: auth.currentUser?.email,
    displayName: auth.currentUser?.displayName,
    photoURL: auth.currentUser?.photoURL,
  });

  await createShopping(uid);
};

const googleSignIn = async () => {
  const credentials = await signInWithPopup(auth, googleProvider);

  const uid = credentials.user?.uid;

  if (!uid) {
    throw new Error('Error while creating user');
  }

  await setDoc(doc(db, 'users', uid), {
    uid,
    email: auth.currentUser?.email,
    displayName: auth.currentUser?.displayName,
    photoURL: auth.currentUser?.photoURL,
  });

  await createShopping(uid);
};

const signIn = async (dto: AuthDto) => {
  return signInWithEmailAndPassword(auth, dto.email, dto.password);
};

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const useSignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationKey: ['signUp'],
    mutationFn: (dto: AuthDto) => signUp(dto),
    onSuccess: () => {
      navigate('/profile');
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    },
  });
};

export const useSignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationKey: ['signIn'],
    mutationFn: (dto: AuthDto) => signIn(dto),
    onSuccess: () => {
      navigate('/profile');
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      }
      throw error;
    },
  });
};

export const useResetPassword = () => {
  const toast = useToast();

  return useMutation({
    mutationKey: ['passwordReset'],
    mutationFn: (email: string) => resetPassword(email),
    onSuccess: () => {
      toast({
        title: 'Check your email for further instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    },
  });
};

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationKey: ['googleAuth'],
    mutationFn: googleSignIn,
    onSuccess: () => {
      navigate('/profile');
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    },
  });
};

export const useFacebookAuth = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationKey: ['facebookAuth'],
    mutationFn: () => signInWithPopup(auth, facebookProvider),
    onSuccess: () => {
      navigate('/profile');
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    },
  });
};
