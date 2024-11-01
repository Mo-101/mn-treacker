import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rat, PawPrint, Lock, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { toast } from './ui/use-toast';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Sign In Successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      console.error('Sign In Error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Sign In Successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      console.error('Google Sign In Error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center">
            <Rat className="mr-2" /> Sign In
          </CardTitle>
          <CardDescription className="text-sm">Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-4"
            />
            <Button type="submit" loading={loading} className="w-full mb-4">Sign In</Button>
            <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
              <Mail className="mr-2" /> Sign In with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
