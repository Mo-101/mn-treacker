import React from 'react';
import { Button } from './ui/button';
import { Layers, Settings, Clock } from 'lucide-react';

const TopNavigationBar = ({ onLayerToggle }) => {
  return (
    <div className="w-full bg-black/50 backdrop-blur-md p-4 shadow-lg z-20 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold text-white">Mastomys Habitat & Risk Assessment</h1>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={onLayerToggle}>
          <Layers className="h-5 w-5 text-white" />
        </Button>
        <Button variant="ghost" size="icon">
          <Clock className="h-5 w-5 text-white" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default TopNavigationBar;