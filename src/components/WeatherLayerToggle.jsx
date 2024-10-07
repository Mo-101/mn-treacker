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
    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-lg shadow-lg z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mr-4">Weather Layers</h2>
        <div className="flex space-x-2">
          {layers.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              onClick={() => onLayerChange(id)}
              variant={activeLayer === id ? 'default' : 'outline'}
              className="p-2 bg-opacity-90 hover:bg-opacity-100"
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherLayerToggle;