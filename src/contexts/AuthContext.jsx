import React, { createContext, useContext, useState } from 'react';
import { toast } from '../components/ui/use-toast';

const AuthContext = createContext({});

// Dummy user credentials
const DUMMY_USERS = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const foundUser = DUMMY_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        setUser({ email: foundUser.email });
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        return true;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};