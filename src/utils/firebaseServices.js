import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from '../components/ui/use-toast';

// Authentication Services
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    return userCredential.user;
  } catch (error) {
    toast({
      title: "Sign in failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    toast({
      title: "Account created",
      description: "Your account has been successfully created.",
    });
    return userCredential.user;
  } catch (error) {
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  } catch (error) {
    toast({
      title: "Sign out failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Firestore Services
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
    });
    toast({
      title: "Success",
      description: "Document successfully added.",
    });
    return docRef.id;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to add document: " + error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getDocuments = async (collectionName, options = {}) => {
  try {
    let q = collection(db, collectionName);
    
    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value));
    }
    
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
    }
    
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch documents: " + error.message,
      variant: "destructive",
    });
    throw error;
  }
};