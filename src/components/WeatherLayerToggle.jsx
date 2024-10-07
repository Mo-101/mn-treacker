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
      <div className="flex flex-col space-y-2">
        {layers.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            onClick={() => onLayerChange(id)}
            variant={activeLayer === id ? 'default' : 'outline'}
            className="flex items-center justify-start p-2 bg-opacity-90 hover:bg-opacity-100"
            title={label}
          >
            <Icon className="w-5 h-5 mr-2" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WeatherLayerToggle;