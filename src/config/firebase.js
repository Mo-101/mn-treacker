import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.replace(',', '') || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.replace(',', '') || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.replace(',', '') || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.replace(',', '') || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.replace(',', '') || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.replace(',', '') || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.replace(',', '') || ''
};

// Initialize Firebase with error handling
try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  export { auth };
  export default app;
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}