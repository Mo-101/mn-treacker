import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Wind, CloudRain, Map } from 'lucide-react';
import { Button } from './ui/button';

const WeatherLayerToggle = ({ activeLayer, onLayerChange }) => {
  const layers = [
    { id: 'default', icon: Map, label: 'Default' },
    { id: 'temperature', icon: Sun, label: 'Temperature' },
    { id: 'wind', icon: Wind, label: 'Wind' },
    { id: 'precipitation', icon: CloudRain, label: 'Precipitation' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-lg shadow-lg"
    >
      <div className="flex space-x-2">
        {layers.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            onClick={() => onLayerChange(id)}
            variant={activeLayer === id ? 'default' : 'outline'}
            className="flex items-center justify-center p-2"
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherLayerToggle;