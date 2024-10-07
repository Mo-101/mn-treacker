import React from 'react';
import { Button } from './ui/button';
import { Layers, Settings, Clock, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedIcon = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: 360 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const TopNavigationBar = ({ onLayerToggle, onAITrainingToggle }) => {
  return (
    <div className="w-full bg-black p-4 shadow-lg z-20 flex justify-between items-center border-b-2 border-yellow-400">
      <div className="flex items-center space-x-2">
        <img src="/wizard-logo.png" alt="Wizard Logo" className="h-12 w-12" />
        <h1 className="text-xl font-bold text-yellow-400">Mastomys Habitat & Risk Assessment</h1>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={onLayerToggle} className="hover:bg-yellow-400 hover:text-black transition-colors">
          <AnimatedIcon>
            <Layers className="h-5 w-5 text-yellow-400" />
          </AnimatedIcon>
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-yellow-400 hover:text-black transition-colors">
          <AnimatedIcon>
            <Clock className="h-5 w-5 text-yellow-400" />
          </AnimatedIcon>
        </Button>
        <Button variant="ghost" size="icon" onClick={onAITrainingToggle} className="hover:bg-yellow-400 hover:text-black transition-colors">
          <AnimatedIcon>
            <Brain className="h-5 w-5 text-yellow-400" />
          </AnimatedIcon>
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-yellow-400 hover:text-black transition-colors">
          <AnimatedIcon>
            <Settings className="h-5 w-5 text-yellow-400" />
          </AnimatedIcon>
        </Button>
      </div>
    </div>
  );
};

export default TopNavigationBar;