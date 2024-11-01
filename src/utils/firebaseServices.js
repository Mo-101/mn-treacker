import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
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