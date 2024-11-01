import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { signIn, signUp, logOut } from '../utils/firebaseServices';

const FirebaseTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button onClick={handleSignIn} disabled={loading}>
              Sign In
            </Button>
            <Button onClick={handleSignUp} disabled={loading} variant="outline">
              Create Account
            </Button>
            <Button onClick={handleLogOut} disabled={loading} variant="ghost">
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTest;