import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { toast } from '../components/ui/use-toast';

// Validate required Firebase config variables
const requiredConfig = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredConfig.filter(key => !import.meta.env[key]);

if (missingVars.length > 0) {
  console.error('Missing Firebase configuration variables:', missingVars);
  toast({
    title: "Configuration Error",
    description: "Firebase configuration is incomplete. Please check your environment variables.",
    variant: "destructive",
  });
  throw new Error('Missing Firebase configuration');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  toast({
    title: "Firebase Error",
    description: "Failed to initialize Firebase. Please check your configuration.",
    variant: "destructive",
  });
  throw error;
}

export { auth };
export default app;