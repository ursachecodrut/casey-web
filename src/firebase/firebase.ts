// import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseOptions from '../config/firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseOptions);
export const auth = getAuth(app);

export default app;
