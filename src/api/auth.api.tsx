import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { useToast } from '@chakra-ui/react';
import { AuthDto } from '../dtos';
import { handleFirebaseError } from '../firebase/firebase.errors';
import { auth, facebookProvider, googleProvider } from '../firebase/firebase';

const signUp = async (dto: AuthDto) => {
  return createUserWithEmailAndPassword(auth, dto.email, dto.password);
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
    mutationFn: () => signInWithPopup(auth, googleProvider),
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
