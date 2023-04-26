// import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
} from 'firebase/auth';
import firebaseOptions from '../config/firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseOptions);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });
facebookProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
