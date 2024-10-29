import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cloud, Thermometer, Droplet, Wind, Search, Leaf, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from './ui/use-toast';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle, onOpacityChange, layers, selectAll, onSelectAllLayers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const weatherLayers = [
    { 
      id: 'temperature', 
      name: 'Temperature', 
      icon: Thermometer,
      description: 'High-resolution temperature data',
      color: 'text-red-500'
    },
    { 
      id: 'precipitation', 
      name: 'Precipitation', 
      icon: Droplet,
      description: 'Shows rainfall intensity',
      color: 'text-blue-500'
    },
    { 
      id: 'vegetation', 
      name: 'Vegetation', 
      icon: Leaf,
      description: 'Vegetation density',
      color: 'text-green-500'
    },
    { 
      id: 'wind', 
      name: 'Wind Speed', 
      icon: Wind,
      description: 'Wind patterns and speed',
      color: 'text-cyan-500'
    },
    { 
      id: 'clouds', 
      name: 'Cloud Cover', 
      icon: Cloud,
      description: 'Cloud coverage data',
      color: 'text-gray-500'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    toast({
      title: "Searching",
      description: `Looking for: ${searchQuery}`,
    });
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 z-30 overflow-y-auto shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 right-4 hover:bg-white/10 transition-colors"
      >
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
        Weather Layers
      </h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative group">
          <Input
            type="text"
            placeholder="Search layers or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border-white/10 focus:border-blue-500/50 transition-all duration-300
                     text-white placeholder-white/50 rounded-lg pr-10"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
          </Button>
          <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-blue-500/50 
                        transition-colors pointer-events-none" />
        </div>
      </form>

      <div className="space-y-6">
        <TooltipProvider>
          {weatherLayers.map((layer) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 
                                  transition-colors cursor-pointer group">
                      <span className="flex items-center gap-3">
                        <layer.icon className={`h-5 w-5 ${layer.color} transition-transform group-hover:scale-110`} />
                        <span className="font-medium">{layer.name}</span>
                      </span>
                      <Switch
                        checked={activeLayers.includes(layer.id)}
                        onCheckedChange={() => onLayerToggle(layer.id)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                    <Slider
                      defaultValue={[100]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) => onOpacityChange(layer.id, value[0])}
                      disabled={!activeLayers.includes(layer.id)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{layer.description}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </TooltipProvider>
      </div>

      <motion.div
        className="mt-8 pt-4 border-t border-white/10"
        whileHover={{ scale: 1.02 }}
      >
        <Button
          onClick={onSelectAllLayers}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                   text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg
                   hover:shadow-blue-500/25"
        >
          {selectAll ? 'Deselect All Layers' : 'Select All Layers'}
        </Button>
      </motion.div>

      <div className="mt-8 space-y-4 p-4 bg-white/5 rounded-lg">
        <h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Environmental Trends
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-red-400" />
              Temperature
            </span>
            <span className="text-red-400">+2.5°C</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-400" />
              Moisture
            </span>
            <span className="text-blue-400">-5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-400" />
              Vegetation
            </span>
            <span className="text-green-400">+10%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;
