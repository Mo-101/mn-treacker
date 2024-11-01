import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Dummy authentication
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'password123') {
        toast({
          title: "Success",
          description: "Welcome back!",
          variant: "default",
        });
        // Here you would typically set authentication state
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Try user@example.com / password123",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="w-[380px] p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4"
            >
              <LogIn className="h-12 w-12 text-purple-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-purple-200/70">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all transform hover:shadow-lg disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200/50">
              Demo credentials:<br />
              user@example.com / password123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;