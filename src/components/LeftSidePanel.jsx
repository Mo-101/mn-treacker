import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Cloud, Thermometer, Wind, Droplet } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle, onOpacityChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const layers = [
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'satellite', label: 'Satellite', icon: MapPin },
    { id: 'temperatures', label: 'Temperature', icon: Thermometer },
    { id: 'wind', label: 'Wind', icon: Wind },
    { id: 'precipitation', label: 'Precipitation', icon: Droplet },
    { id: 'prediction', label: 'Prediction Hotspots', icon: MapPin },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const handleLayerToggle = (layerId) => {
    onLayerToggle(layerId);
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full w-64 sm:w-80 bg-[#1e293b] text-white p-4 z-30 overflow-y-auto pointer-events-auto"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-bold mb-4">Map Layers</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for sightings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 bg-[#0f172a] border-gray-600"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        <AnimatePresence>
          {layers.map((layer) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <layer.icon className="mr-2 h-5 w-5" />
                <span>{layer.label}</span>
              </div>
              <Switch
                checked={activeLayers.includes(layer.id)}
                onCheckedChange={() => handleLayerToggle(layer.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Layer Opacity</h3>
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          className="w-full"
          onValueChange={(value) => onOpacityChange(value[0])}
        />
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;