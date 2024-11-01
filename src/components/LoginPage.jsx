import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rat, Info } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from './ui/alert';

const LoginPage = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const { signIn, loading } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signIn(email, password);
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
            <Rat className="mr-2" /> Demo Login
          </CardTitle>
          <CardDescription className="text-sm">Sign in with demo credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Demo credentials:<br />
              Email: user@example.com<br />
              Password: password123
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginPage;