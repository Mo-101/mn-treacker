import React from 'react';
import { Button } from './ui/button';
import { Layers, Settings, Clock, Brain, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const AnimatedIcon = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: 360 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const TopNavigationBar = ({ onLayerToggle, onAITrainingToggle, onPredictionToggle }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-2 z-20 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/wizard-logo.png" alt="Wizard Logo" className="h-8 w-8" />
        <h1 className="text-lg font-bold text-yellow-400">Mastomys Habitat & Risk Assessment</h1>
      </div>
      <TooltipProvider>
        <div className="flex space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onLayerToggle} className="hover:bg-yellow-400 hover:text-black transition-colors">
                <AnimatedIcon>
                  <Layers className="h-4 w-4 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Layers</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-yellow-400 hover:text-black transition-colors">
                <AnimatedIcon>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Time Controls</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onAITrainingToggle} className="hover:bg-yellow-400 hover:text-black transition-colors">
                <AnimatedIcon>
                  <Brain className="h-4 w-4 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Training</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onPredictionToggle} className="hover:bg-yellow-400 hover:text-black transition-colors">
                <AnimatedIcon>
                  <ChartBar className="h-4 w-4 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Predictions</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-yellow-400 hover:text-black transition-colors">
                <AnimatedIcon>
                  <Settings className="h-4 w-4 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default TopNavigationBar;