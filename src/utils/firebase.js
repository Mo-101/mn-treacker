import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { toast } from '../components/ui/use-toast';
import app from '../config/firebase';

let db;

try {
  db = getFirestore(app);
  
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
} catch (error) {
  console.error('Error initializing Firestore:', error);
  toast({
    title: "Database Error",
    description: "Failed to initialize database. Some features may be unavailable.",
    variant: "destructive"
  });
}

export { db };