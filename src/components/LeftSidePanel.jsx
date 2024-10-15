import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Cloud, Thermometer, Sun, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import PropTypes from 'prop-types';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle, onOpacityChange, selectAll, onSelectAllLayers }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const weatherLayers = [
    { id: 'precipitation', name: 'Precipitation', icon: Cloud },
    { id: 'temp', name: 'Temperature', icon: Thermometer },
    { id: 'clouds', name: 'Cloud Cover', icon: Sun },
    { id: 'wind', name: 'Wind Speed', icon: Wind },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const handleLayerToggle = (layerId) => {
    console.log('Toggling layer:', layerId);
    onLayerToggle(layerId);
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 sm:w-72 md:w-80 bg-[#1e293b] text-white p-4 z-30 overflow-y-auto"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <h2 className="text-lg sm:text-xl font-bold mb-4">Weather Layers</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 bg-[#0f172a] border-gray-600 text-sm sm:text-base"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        {weatherLayers.map((layer) => (
          <div key={layer.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm sm:text-base">
                <layer.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {layer.name}
              </span>
              <Switch
                checked={activeLayers.includes(layer.id)}
                onCheckedChange={() => handleLayerToggle(layer.id)}
              />
            </div>
            <Slider
              defaultValue={[100]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={(value) => {
                console.log(`Layer: ${layer.id}, Opacity: ${value[0]}`);
                onOpacityChange(layer.id, value[0]);
              }}
              disabled={!activeLayers.includes(layer.id)}
            />
          </div>
        ))}
      </div>
      <Button
        onClick={onSelectAllLayers}
        className="mt-4 w-full text-sm sm:text-base"
      >
        {selectAll ? 'Deselect All Layers' : 'Select All Layers'}
      </Button>
    </motion.div>
  );
};

LeftSidePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activeLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLayerToggle: PropTypes.func.isRequired,
  onOpacityChange: PropTypes.func.isRequired,
  selectAll: PropTypes.bool.isRequired,
  onSelectAllLayers: PropTypes.func.isRequired,
};

export default LeftSidePanel;