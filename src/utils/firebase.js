import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { toast } from '../components/ui/use-toast';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with error handling
const initializeFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        toast({
          title: "Offline mode unavailable",
          description: "Multiple tabs open. Offline mode can only be enabled in one tab at a time.",
          variant: "warning"
        });
      } else if (err.code === 'unimplemented') {
        toast({
          title: "Offline mode unavailable",
          description: "Your browser doesn't support offline persistence",
          variant: "warning"
        });
      }
    });

    return { app, db };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    toast({
      title: "Connection Error",
      description: "Failed to initialize Firebase. Please check your internet connection.",
      variant: "destructive"
    });
    return null;
  }
};

export const { app, db } = initializeFirebase() || {};

// Retry mechanism for failed connections
export const retryOperation = async (operation, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};