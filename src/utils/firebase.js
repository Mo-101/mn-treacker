import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { toast } from '../components/ui/use-toast';

let db;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Enable offline persistence with forceOwnership to prevent reader lock
  enableIndexedDbPersistence(db, { forceOwnership: true }).catch((err) => {
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
} catch (error) {
  console.error('Error initializing Firestore:', error);
  toast({
    title: "Database Error",
    description: "Failed to initialize database. Some features may be unavailable.",
    variant: "destructive"
  });
}

export { db };