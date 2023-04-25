import { UseToastOptions } from '@chakra-ui/react';
import { FirebaseError } from 'firebase/app';

const TOAST_DURATION = 5000;
const TOAT_IS_CLOSABLE = true;
const TOAST_STATUS = 'error';

export const handleFirebaseError = (error: FirebaseError): UseToastOptions => {
  let description = 'Unknown error';

  switch (error.code) {
    case 'auth/email-already-in-use':
      description = 'Email already in use';
      break;
    case 'auth/invalid-email':
      description = 'Invalid email';
      break;
    case 'auth/user-not-found':
      description = 'Account not found';
      break;
    case 'auth/account-exists-with-different-credential':
      description = 'Account already exists with different credential';
      break;
    default:
      console.error(error);
      break;
  }

  return {
    description,
    duration: TOAST_DURATION,
    isClosable: TOAT_IS_CLOSABLE,
    status: TOAST_STATUS,
  };
};
