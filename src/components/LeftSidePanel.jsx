import React from 'react';
import { motion } from 'framer-motion';
import { X, Cloud, Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { toast } from './ui/use-toast';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle, onOpacityChange }) => {
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
    }
  ];

  const handleLayerToggle = (layerId) => {
    onLayerToggle(layerId);
    toast({
      title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
      description: activeLayers.includes(layerId) ? "Layer disabled" : "Layer enabled",
    });
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 z-30 overflow-y-auto shadow-2xl"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 right-4 hover:bg-white/10 transition-colors"
      >
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
        Weather Layers
      </h2>

      <div className="space-y-4">
        {weatherLayers.map((layer) => (
          <div key={layer.id} className="space-y-2 bg-black/40 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <layer.icon className={`h-5 w-5 ${activeLayers.includes(layer.id) ? layer.color : 'text-gray-500'}`} />
                <span className={activeLayers.includes(layer.id) ? 'text-yellow-400' : 'text-gray-400'}>
                  {layer.name}
                </span>
              </span>
              <Switch 
                checked={activeLayers.includes(layer.id)}
                onCheckedChange={() => handleLayerToggle(layer.id)}
                className="data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-gray-600"
              />
            </div>
            <p className="text-sm text-gray-400">{layer.description}</p>
            <Slider 
              defaultValue={[100]} 
              max={100} 
              step={1}
              onValueChange={(value) => onOpacityChange(layer.id, value[0])}
              disabled={!activeLayers.includes(layer.id)}
              className={`${
                activeLayers.includes(layer.id)
                  ? '[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400'
                  : '[&_.relative]:bg-gray-600/20 [&_[role=slider]]:bg-gray-500 [&_[role=slider]]:border-gray-500 [&_.absolute]:bg-gray-500'
              }`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;