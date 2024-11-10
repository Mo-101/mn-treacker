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
    <div className="w-full bg-white/80 backdrop-blur-md p-4 shadow-lg z-10 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Weather Map</h1>
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
  );
};

export default WeatherLayerToggle;