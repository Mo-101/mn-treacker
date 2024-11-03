import React from 'react';
import { motion } from 'framer-motion';
import { X, Cloud, Thermometer, Droplet, Wind, MapPin, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle }) => {
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
    },
    {
      id: 'points',
      name: 'Rat Locations',
      icon: MapPin,
      description: 'Mastomys natalensis sightings',
      color: 'text-yellow-500'
    },
    {
      id: 'cases',
      name: 'Lassa Cases',
      icon: Activity,
      description: 'Reported Lassa fever cases',
      color: 'text-red-600'
    }
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
      className="fixed left-0 top-0 h-full w-[90vw] sm:w-80 md:w-96 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6 z-30 overflow-y-auto shadow-2xl"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 right-4 hover:bg-white/10 transition-colors"
      >
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300 pr-12">
        Map Layers
      </h2>

      <div className="space-y-4">
        {weatherLayers.map((layer) => (
          <div 
            key={layer.id} 
            className="space-y-2 bg-black/40 p-3 rounded-lg transform transition-all duration-300 hover:translate-x-1 hover:bg-black/50"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <layer.icon className={`h-5 w-5 ${layer.color}`} />
                <span className="text-yellow-400">{layer.name}</span>
              </span>
              <Switch 
                checked={activeLayers.includes(layer.id)}
                onCheckedChange={() => onLayerToggle(layer.id)}
                className="data-[state=checked]:bg-yellow-400"
              />
            </div>
            <p className="text-sm text-gray-400">{layer.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;