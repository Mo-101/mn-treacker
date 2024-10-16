import React from 'react';
import { Button } from './ui/button';

const WeatherLayerControls = ({ activeLayers, toggleLayer }) => {
  const layers = [
    { id: 'default', name: 'Default' },
    { id: 'temperature', name: 'Temperature' },
    { id: 'precipitation', name: 'Precipitation' },
    { id: 'clouds', name: 'Clouds' },
    { id: 'radar', name: 'Radar' },
    { id: 'wind', name: 'Wind' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Weather Layers</h3>
      <div className="space-y-2">
        {layers.map((layer) => (
          <Button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            variant={activeLayers.includes(layer.id) ? 'default' : 'outline'}
            className="w-full"
          >
            {layer.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WeatherLayerControls;