import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                <LogIn className="h-12 w-12 text-purple-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-purple-200/70">Sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;