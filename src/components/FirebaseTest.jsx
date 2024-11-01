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
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="flex space-x-2">
            <Button onClick={handleSignIn} disabled={loading}>
              Sign In
            </Button>
            <Button onClick={handleSignUp} disabled={loading} variant="outline">
              Sign Up
            </Button>
            <Button onClick={handleLogOut} disabled={loading} variant="destructive">
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTest;