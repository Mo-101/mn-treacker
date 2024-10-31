import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { signIn, signUp, logOut, addDocument, getDocuments } from '../utils/firebaseServices';

const FirebaseTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documents, setDocuments] = useState([]);
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

  const handleAddDocument = async () => {
    setLoading(true);
    try {
      await addDocument('test-collection', {
        testField: 'Test Value',
        timestamp: new Date().toISOString()
      });
      // Refresh documents after adding
      fetchDocuments();
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments('test-collection', {
        orderBy: {
          field: 'createdAt',
          direction: 'desc'
        },
        limit: 10
      });
      setDocuments(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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

      <Card>
        <CardHeader>
          <CardTitle>Firestore Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleAddDocument} disabled={loading}>
            Add Test Document
          </Button>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent Documents:</h3>
            {documents.map((doc) => (
              <div key={doc.id} className="p-2 bg-gray-100 rounded">
                <p>ID: {doc.id}</p>
                <p>Test Field: {doc.testField}</p>
                <p>Created: {new Date(doc.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTest;