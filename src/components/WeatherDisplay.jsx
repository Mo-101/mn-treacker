import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Wind, CloudRain } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const WeatherDisplay = ({ activeLayer, onLayerChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 left-4 bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-white"
    >
      <h2 className="text-2xl font-bold mb-4">Weather Layers</h2>
      <div className="space-y-2">
        <Button
          onClick={() => onLayerChange('temperature')}
          variant={activeLayer === 'temperature' ? 'default' : 'outline'}
          className="w-full flex items-center justify-start space-x-2"
        >
          <Sun className="w-5 h-5" />
          <span>Temperature</span>
        </Button>
        <Button
          onClick={() => onLayerChange('wind')}
          variant={activeLayer === 'wind' ? 'default' : 'outline'}
          className="w-full flex items-center justify-start space-x-2"
        >
          <Wind className="w-5 h-5" />
          <span>Wind</span>
        </Button>
        <Button
          onClick={() => onLayerChange('precipitation')}
          variant={activeLayer === 'precipitation' ? 'default' : 'outline'}
          className="w-full flex items-center justify-start space-x-2"
        >
          <CloudRain className="w-5 h-5" />
          <span>Precipitation</span>
        </Button>
      </div>
      <div className="mt-6">
        <Input
          placeholder="Search for rat sightings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleSearch} className="w-full">Search</Button>
      </div>
    </motion.div>
  );
};

export default WeatherDisplay;