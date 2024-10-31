import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { toast } from '../components/ui/use-toast';

const firebaseConfig = {
  apiKey: "AIzaSyDOUulXTSBdX_2nlho7XPvEmfdLAAzEVFs",
  authDomain: "mntrk-fcd2b.firebaseapp.com",
  projectId: "mntrk-fcd2b",
  storageBucket: "mntrk-fcd2b.firebasestorage.app",
  messagingSenderId: "1085269350728",
  appId: "1:1085269350728:web:b0d91829b50518348bfb7d",
  measurementId: "G-CSTKQGTRZ1"
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