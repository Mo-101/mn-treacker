import React from 'react';
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
    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-lg shadow-lg">
      <div className="flex space-x-2">
        {layers.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            onClick={() => onLayerChange(id)}
            variant={activeLayer === id ? 'default' : 'outline'}
            className="flex items-center justify-center p-2 bg-opacity-90 hover:bg-opacity-100"
            title={label}
          >
            <Icon className="w-5 h-5" />
            <span className="ml-2 hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WeatherLayerToggle;