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
        <img src="/wizard-logo.png" alt="Wizard Logo" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
        <h1 className="text-xs sm:text-sm md:text-lg font-bold text-yellow-400 hidden sm:block">Mastomys Habitat & Risk Assessment</h1>
      </div>
      <TooltipProvider>
        <div className="flex space-x-1 sm:space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onLayerToggle} className="hover:bg-yellow-400 hover:text-black transition-colors p-1 sm:p-2">
                <AnimatedIcon>
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Layers</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-yellow-400 hover:text-black transition-colors p-1 sm:p-2">
                <AnimatedIcon>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Time Controls</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onAITrainingToggle} className="hover:bg-yellow-400 hover:text-black transition-colors p-1 sm:p-2">
                <AnimatedIcon>
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Training</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onPredictionToggle} className="hover:bg-yellow-400 hover:text-black transition-colors p-1 sm:p-2">
                <AnimatedIcon>
                  <ChartBar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </AnimatedIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Predictions</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-yellow-400 hover:text-black transition-colors p-1 sm:p-2">
                <AnimatedIcon>
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
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